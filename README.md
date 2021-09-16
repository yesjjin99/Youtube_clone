# Youtube_clone

## 1. Boiler Plate 이용 (레이아웃)

[레이아웃](https://github.com/jaewonhimnae/boilerplate-mern-stack)

```
👉🏻 npm install 
   (서버, 클라이언트에서 dependencies 다운받기)
👉🏻 server-config-dev.js 파일 생성 (local에서 작업할 때)
👉🏻 MongoDB 로그인
👉🏻 클러스터 만든 후 아이디, 비번 생성하고 dev.js 파일 넣는다
```

## 2. 비디오 업로드 FORM

```
👉🏻 Upload Page
👉🏻 Upload Page Route
👉🏻 Upload Page Header Tab
👉🏻 Form Template

👉🏻 npm install react-dropzone --save
   (파일 올리는 Template 만들기 위해 Drop-zone 다운)
👉🏻 onChange func 만들기
```

## 3. Multer로 서버에 비디오 저장하기

```
👉🏻 onDrop func 만들기
👉🏻 npm install multer --save 
    in Server directory
   (노드 서버에 파일을 저장하기 위해 Dependency를 먼저 다운로드)
👉🏻 비디오 파일을 서버로 보내기
👉🏻 받은 비디오 파일을 서버에 저장
👉🏻 파일 저장 경로를 클라이언트로 전달해 주기
```

## 4. ffmpeg로 비디오 썸네일 생성하기

```
👉🏻 썸네일 생성을 위한 Dependency 다운받기
    
   fluent-ffmpeg를 다운 받기 위한 필수 조건
   : ffmpeg 설치(windows) / brew install ffmpeg(mac)
   Download fluent-ffmpeg Dependency
   : npm install fluent-ffmpeg --save

👉🏻 서버에 저장된 비디오를 이용한 썸네일 생성
👉🏻 생성된 썸네일을 서버에 저장
👉🏻 썸네일 이미지 파일 경로 정보를 클라이언트에 보내기
👉🏻 썸네일 이미지를 화면에 표시
```

## 5. 비디오 업로드 하기

```
👉🏻 비디오 Collection을 만든다
   (writer, title, description, privacy, filePath, category, views, duration, thumbnail)
👉🏻 onSubmit function을 만든다
👉🏻 요청할 데이터들을 서버로 보낸다
👉🏻 보낸 데이터들을 MongoDB에 저장한다
```

## 6. 랜딩 페이지에 비디오들 나타나게 하기

```
👉🏻 빈 랜딩 페이지 생성
👉🏻 비디오 카드 Template 만들기
👉🏻 MongoDB에서 모든 비디오 데이터 가져오기
👉🏻 가져온 비디오 데이터들을 스크린에 출력하기
   Use map() methods
```

## 7. 비디오 디테일 페이지 만들기

```
👉🏻 비어있는 비디오 디테일 페이지 생성
👉🏻 비디오 디테일 페이지를 위한 Route 만들기
👉🏻 비디오 디테일 페이지 Template 만들기
👉🏻 MongoDB에서 비디오 데이터 가져오기
👉🏻 가져온 데이터들을 스크린에 출력
```
