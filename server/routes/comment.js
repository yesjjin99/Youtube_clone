const express = require('express');
const router = express.Router();
const { Comment } = require("../models/Comment");

//=================================
//            Comment
//=================================

router.post('/saveComment', (req, res) => {
    
    const comment = new Comment(req.body) 
    // Comment 모델로 instance 생성하고 클라이언트에서 불러온 모든 정보 넣어줌

    comment.save((err, comment) => {
        if(err) return res.json({ success: false, err })

        Comment.find({'_id': comment._id}) // save 안에서는 populate 그냥 못 돌리기 때문에 id 찾고 그 안에서 populate 돌림
            .populate('writer') // writer의 모든 정보 얻고 싶으면 populate 돌려야 함
            .exec((err, result) => {
                if(err) return res.json({ success: false, err })
                res.status(200).json({ success: true, result })
            })
    })
    // 모든 정보들을 MongoDB에 저장

})

module.exports = router;
