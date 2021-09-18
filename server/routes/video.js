const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const { Subscriber } = require('../models/Subscriber');

const { auth } = require("../middleware/auth");
const multer = require("multer")
const ffmpeg = require("fluent-ffmpeg");

// STORAGE MULTER CONFIG
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // 파일 올리면 uploads 폴더 안(destination)으로 저장됨
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if(ext !== '.mp4') {
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true)
    }
});

const upload = multer({ storage: storage }).single("file");

//=================================
//             Video
//=================================

router.get('/getVideos', (req, res) => {
    // 비디오를 DB에서 가져와서 클라이언트에 보낸다.

    Video.find()
        .populate('writer') // Video model에서 Schema.Types.ObjectId로 User의 모든 정보 가져오려면 여기서 populate 해줘야 함
        .exec((err, videos) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({ success: true, videos })
        }) // 쿼리 execution
})

router.post('/getSubscriptionVideos', (req, res) => {
    
    // 자신의 아이디를 가지고 구독하는 사람들을 찾는다.

    Subscriber.find({ userFrom: req.body.userFrom })
        .exec((err, subscriberInfo) => {
            if(err) return res.status(400).send(err)

            let subscribedUser = []; // userTo 정보 넣어줌

            subscriberInfo.map((subscriber, i) => {
                subscribedUser.push(subscriber.userTo)
            })

            // 찾은 사람들의 비디오를 가지고 온다.

            Video.find({ writer : { $in: subscribedUser }}) // 1명 이상일 때
                .populate('writer')
                .exec((err, videos) => {
                    if(err) return res.status(400).send(err)
                    res.status(200).json({ success: true, videos })
                })

        })

})

router.post('/uploadfiles', (req, res) => {
    // 비디오를 서버에 저장한다.
    upload(req, res, err => {
        if(err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename }) // uploads 폴더 안에 들어간 파일 경로 url로 알려줌
    })
})

router.post('/uploadVideo', (req, res) => {
    // 비디오 정보들을 저장한다.

    const video = new Video(req.body)
    // 클라이언트에서 보낸 정보들(variables)이 req.body에 담김

    video.save((err, doc) => {
        if(err) return res.json({ success: false, err })
        res.status(200).json({ success: true })
    }) // MongoDB에 저장
})

router.post('/thumbnail', (req, res) => {
    // 썸네일 생성하고 비디오 러닝타임도 가져오기

    let filePath = ""
    let fileDuration = ""

    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, (err, metadata) => {
        console.dir(metadata); // all metadata
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration
    });

    // 썸네일 생성
    ffmpeg(req.body.url) // 클라이언트에서 온 비디오 저장 경로
    .on('filenames', (filenames) => {
        console.log('Will generate ' + filenames.join(', '))
        console.log(filenames)

        filePath = "uploads/thumbnails/" + filenames[0]
    }) // 비디오 썸네일 파일네임 생성
    .on('end', () => {
        console.log('Screenshots taken')
        return res.json({ success: true, url: filePath, fileDuration: fileDuration })
    }) // 썸네일 생성하고 나서 무엇을 할 것인지
    .on('error', (err) => {
        console.error(err)
        return res.json({ success: false, err })
    })
    .screenshots({
        // Will take screenshots at 20%, 40%, 60%, and 80% of the video
        count: 3,
        folder: 'uploads/thumbnails',
        size: '320x240',
        // '%b': input basename (filename w/o extension)
        filename: 'thumbnail-%b.png'
    })
})

router.post('/getVideoDetail', (req, res) => {
    
    Video.findOne({ "_id" : req.body.videoId })
        .populate('writer') // writer에는 id만 있는데, populate을 해서 해당 user의 모든 정보를 가져옴
        .exec((err, videoDetail) => {
            if(err) return res.status(400).send(err)
            return res.status(200).json({ success: true, videoDetail })
        })
        
})

module.exports = router;
