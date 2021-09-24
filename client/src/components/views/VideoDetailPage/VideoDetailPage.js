import React, { useState, useEffect } from 'react'
import { Row, Col, List, Avatar } from 'antd'
import Axios from 'axios'
import SideVideo from './Sections/SideVideo'
import Subscribe from './Sections/Subscribe'
import Comment from './Sections/Comment'

function VideoDetailPage(props) { // props 쓰려면 무조건 메인 function 괄호 안에 props 넣어줘야 함

    const videoId = props.match.params.videoId
    const variable = { videoId: videoId }

    const [VideoDetail, setVideoDetail] = useState([])
    const [Comments, setComments] = useState([])

    useEffect(() => {
        
        Axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if(response.data.success) {
                    setVideoDetail(response.data.videoDetail)
                    console.log(response.data.videoDetail)
                } else {
                    alert('비디오 정보를 가져오는 데 실패했습니다.')
                }
            }) // routes 에서 받아옴

        Axios.post('/api/comment/getComments', variable) // 모든 댓글 정보 가져오기
            .then(response => {
                if(response.data.success) {
                    setComments(response.data.comments)
                    console.log(response.data.comments)
                } else {
                    alert('댓글 정보를 가져오는 데 실패했습니다.')
                }   
            })   

    }, [])

    const refreshFunction = (newComment) => {
        setComments(Comments.concat(newComment))
    } 
    // 기존 Comments에 Comment.js와 SingleComment.js에서 받아온 newComment 추가(Concat)

    if(VideoDetail.writer) {

        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')} />
        // userTo 랑 userFrom 이 다르면 subscribeButton 이 나오도록 (내 계정은 구독 못하도록)
        // Subscribe -> userTo => props 넘겨줌

        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24} >
                    <div style={{ width: '100%', padding: '3rem 4rem' }}>
                        <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />
    
                        <List.Item
                            actions={[ subscribeButton ]} // props으로 넘겨줌
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer.image} />}
                                title={VideoDetail.title}
                                description={VideoDetail.description}
                            />
    
                        </List.Item>
    
                        {/* Comments */}
                        <Comment commentLists={Comments} postId={videoId} refreshFunction={refreshFunction} />
    
                    </div>
                </Col>
                <Col lg={6} xs={24} >
                    
                    <SideVideo /> 
                    {/* SideVideo component(위에서 import) */}

                </Col>
            </Row>
        )
    } else {
        return (
            <div>...loading </div>
        )
    }

}

export default VideoDetailPage
