import React, { useState, useEffect } from 'react'
import { Row, Col, List, Avatar } from 'antd'
import Axios from 'axios'
import SideVideo from './Sections/SideVideo'
import Subscribe from './Sections/Subscribe'
import Comment from './Sections/Comment'

function VideoDetailPage(props) {

    const videoId = props.match.params.videoId
    const variable = { videoId: videoId }

    const [VideoDetail, setVideoDetail] = useState([])

    useEffect(() => {
        
        Axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if(response.data.success) {
                    setVideoDetail(response.data.videoDetail)
                } else {
                    alert('비디오 정보를 가져오는 데 실패했습니다.')
                }
            })

    }, [])

    if(VideoDetail.writer) {

        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')} />
        // userTo 랑 userFrom 이 다르면 subscribeButton 이 나오도록 (내 계정은 구독 못하도록)

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
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}
                            />
    
                        </List.Item>
    
                        {/* Comments */}
                        <Comment />
    
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
