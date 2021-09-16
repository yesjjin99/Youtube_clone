/* react
단축키 rfce
-> 자동으로 function 만들고 export 까지 코드 만들어줌
*/
import React, { useState } from 'react';
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { useSelector } from 'react-redux';

const { TextArea } = Input;
const { Title } = Typography;

const PrivateOptions = [
    { value: 0, label: "Private" },
    { value: 1, label: "Public" }
] // map method

const CategoryOptions = [
    { value: 0, label: "Film & Animation" },
    { value: 1, label: "Auto & Vehicles" },
    { value: 2, label: "Music" },
    { value: 3, label: "Pets & Animals" },
]

function VideoUploadPage(props) {

    const user = useSelector(state => state.user);
    // state에서 user의 모든 정보를 user 변수에 가져옴
    // redux로 확인해보기
    const [VideoTitle, setVideoTitle] = useState("")
    // useState -> 자동으로 state 만들어줌
    // state 안에 value 저장해 놓고 나중에 서버에 한꺼번에 보내줌
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0) // private이면 0, public이면 1
    const [Category, setCategory] = useState("Film & Animation")

    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")

    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value)
    }
    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }
    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value)
    }
    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value)
    }

    const onDrop = (files) => {
        let formData = new FormData;
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append("file", files[0])

        // Axios -> 라이브러리 이용해 request를 서버에 보내고 또 받음
        // Axios.post -> post request를 보낼 때 위 코드들을 같이 보내지 않으면 파일을 보낼 때 오류가 생김
        Axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data)

                    let variable = {
                        url: response.data.url,
                        fileName: response.data.fileName
                    }

                    setFilePath(response.data.url)

                    Axios.post('/api/video/thumbnail', variable)
                        .then(response => {
                            if(response.data.success) {
                                console.log(response.data)

                                setDuration(response.data.fileDuration)
                                setThumbnailPath(response.data.url)
                            } else {
                                alert('썸네일 생성에 실패했습니다.')
                            }
                        })
                } else {
                    alert('비디오 업로드를 실패했습니다.')
                }
            })
    }

    const onSubmit = (e) => {
        e.preventDefault(); // 원래 클릭하면 하려고 했던 것들을 방지

        const variables = {
            writer: user.userData._id,
            title: VideoTitle,
            description: Description,
            privacy: Private,
            filePath: FilePath,
            category: Category,
            duration: Duration,
            thumbnail: ThumbnailPath,
        }

        Axios.post('/api/video/uploadVideo', variables)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data)

                    message.success('업로드에 성공했습니다.')

                    setTimeout(() => {
                        props.history.push('/')
                    }, 3000); // 3초 후에 랜딩페이지로
                } else {
                    alert('비디오 업로드에 실패했습니다.')
                }
            })
    }

    return (
        <div style={{ maxWidth:'700px', margin:'2rem auto' }}>
            <div style={{ textAlign:'center', marginBottom:'2rem' }}>
                <Title level={2}>Upload Video</Title>
            </div>
            
            <Form   onSubmit={onSubmit}>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                    {/* Drop zone */}

                    <Dropzone 
                    onDrop={onDrop}
                    multiple={false}
                    maxSize={1000000000}
                    >
                    {({ getRootProps, getInputProps }) => (
                        <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex',
                        alignItems: 'center', justifyContent: 'center' }} {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Icon type="plus" style={{ fontSize:'3rem' }} />
                        </div>
                    )}

                    </Dropzone>
                    {/* Thumbnail */}

                    {ThumbnailPath && /* thumbnailpath가 있을 때에만 실행 */
                        <div>
                            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
                        </div>
                    } 
                </div> 

                <br />
                <br />
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={VideoTitle}
                />
                <br />
                <br />
                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={Description}
                />
                <br />
                <br />

                <select onChange={onPrivateChange}>
                    { PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>

                <br />
                <br />
                <select onChange={onCategoryChange}>
                    { CategoryOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>

                <br />
                <br />
                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
                </Button>
        

            </Form>

        </div>
    )
}

export default VideoUploadPage
