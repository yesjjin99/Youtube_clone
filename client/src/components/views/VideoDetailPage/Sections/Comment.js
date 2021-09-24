import React, { useState } from 'react';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comment(props) {

    const user = useSelector(state => state.user) 
    // Redux에서 State 안에 있는 user 데이터 가져옴
    const videoId = props.postId

    const [commentValue, setcommentValue] = useState("")

    const handleClick = (event) => {
        setcommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();
        // 원래 onSubmit의 기본동작은 Submit 버튼 누르면 reloading 되는 것인데, 아무것도 입력 안했을 때에는 reloading 안되도록 preventDefault 해줌

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
                    setcommentValue("")
                    props.refreshFunction(response.data.result)
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

            {props.commentLists && props.commentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment>
                        <SingleComment comment={comment} postId={videoId} refreshFunction={props.refreshFunction} />
                        <ReplyComment parentCommentId={comment._id} postId={videoId} commentLists={props.commentLists} refreshFunction={props.refreshFunction} />
                    </React.Fragment>
                )

            ))}


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
