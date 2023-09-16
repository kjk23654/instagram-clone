# instagram-clone
## 강의 내용 보면서 따라하는 중

## 1일차(0810)
### 몽고 DB 설치(경로변수 직접 설정)
### postman 설치
### express 설치(+패키지)
### 설정(환경변수, app.js

## 2일차(0817)
### 모델 패키지 작성(User.js,  Post.js, Likes.js, Comment.js,  Following.js,)
### auth/auth.js
### files/photos, files/avatar

## 3일차(0818)
### files와 photos에 사진 파일 추가
### utils(미들웨어)/signUpValidator.js, loginValidator.js, upload.js)
### Seed.js(샘플 데이터) 생성
### DB에 도큐먼트 생성(node seed)

## 4일차(0822)
### 서버 연결(devstart)
### routes/users.js, index.js
### controller/userController.js(create)
### postman으로 회원가입 데이터생성
### controller/userController.js(login)
### postman으로 로그인

## 5일차(0824)
### controller/userController.js(프로필 수정) -> postman으로 프로필 수정 테스트 + 파일 업로드 테스트
### controller/profileController.js, route/profile.js, index.js에 profile 추가 -> postman으로 프로필 목록 검색, 프로필 상세보기

## 6일차(0825)
### controller/progileController.js : 팔로우
### controller/progileController.js : 팔로우 취소
### controller/postController.js : 피드 가져오기

## 7일차(0829)
### controller/postController.js : 게시물 리스트 가져오기
### controller/postController.js : 게시물 한개 가져오기
### controller/postController.js : 게시물 생성
### controller/postController.js : 게시물 삭제 
### controller/postController.js : 좋아요
### controller/postController.js : 좋아요 취소

### controller/commentController.js : 댓글 생성


## 8일차(0831)

### controller/commentController.js : 댓글 가져오기
### controller/commentController.js : 댓글 삭제

### 서버 끝. 
* * * *
###클라이언트 시작

## client
### src/service/api.js : 유저 생성 요청
### src/service/api.js : 로그인 요청
### src/service/api.js : 피드 요청
### src/service/api.js : 게시물 한개 가져오기 요청
### src/service/api.js : 게시물 생성 요청
### src/service/api.js : 게시물 삭제 요청
### src/service/api.js : 좋아요 요청
### src/service/api.js : 좋아요 취소 요청
### src/service/api.js : 댓글 가져오기 요청
### src/service/api.js : 댓글 생성 요청
### src/service/api.js : 댓글 삭제 요청
### src/service/api.js : 프로필 수정 요청
### src/service/api.js : 프로필 사진 수정 요청
### src/service/api.js : 프로필 리스트 가져오기 요청
### src/service/api.js : 프로필 상세보기 요청
### src/service/api.js : 타임라인 가져오기 요청
### src/service/api.js : 팔로워리스트 리스 가져오기 요청
### src/service/api.js : 팔로잉리스트 가져오기 요청
### src/service/api.js : 팔로우 요청
### src/service/api.js : 언팔로우 요청


## 9일차(0901)

### 클라이언트 측 유효성 검사 라이브러리
### src/utils/validator.js : 이메일 유효성 검사
### src/utils/validator.js : 유저이름 유효성 검사
### src/utils/validator.js : 비밀번호 유효성 검사

### src/auth/AuthContext.js
### src/auth/AuthProvider.js
### src/auth/AuthRequired.js

### src/pages에 있는 모든 컴포넌트 작성
### app.js 
### server, client 키기

## 10일차(0905)

### client/src/pages/Login.js
### client/src/pages/SignUp.js
### client/src/pages/Layout.js


## 11일차(0907)
### client/src/pages/profile/profile.js
### client/src/pages/profile/profileInfo.js
### client/src/pages/profile/Thumbnail.js
### client/src/pages/ProfileEdit.js

## 12일차(0912)
### client/src/pages/ProfileEdit.js - 폼(이름 입력란, 자기소개 입력란, 제출 및 취소 버튼)
### client/src/pages/ProfileEdit.js - 파일 처리 + 프로필 수정 요청 + 프로필 사진 수정 요청, 폼 제출 처리

### client/src/pages/PostCreate.js
### client/src/pages/PostView.js