import React, { useState } from 'react';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';

function Comment(props) {

    const user = useSelector(state => state.user) // Redux에서 State 안에 있는 user 데이터 가져옴
    const videoId = props.postId

    const [commentValue, setcommentValue] = useState("")

    const handleClick = (event) => {
        setcommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const variables = {
            content: commentValue,
            writer: user.userData._id, 
            // 2가지 방법 : localStorage, redux(지금 쓴 방법)
            postId: videoId
            // VideoDetailPage.js의 <Comment /> 부분에서 props 받아옴
        }

        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data.result)
                } else {
                    alert('댓글을 저장하지 못했습니다.')
                }
            })
    }

    return (
        <div>
            <br />
            <p> Replies</p>
            <hr />

            {/* Coment Lists */}

            <SingleComment />


            {/* Root Comment Form */}

            <form style={{ display: 'flex' }} onSubmit={onSubmit} >
                <textarea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder="코멘트를 작성해 주세요"
                />
                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >Submit</button>
            </form>
        </div>
    )
}

export default Comment
