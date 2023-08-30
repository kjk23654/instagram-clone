# instagram-clone
## 강의 내용 보면서 따라하는 중

## 1일차(0810)
### 몽고 DB 설치(경로변수 직접 설정)
### postman 설치
### express 설치(+패키지)
### 설정(환경변수, app.js

## 2일차(0817)
###모델 패키지 작성(User.js,  Post.js, Likes.js, Comment.js,  Following.js,)
###auth/auth.js
###files/photos, files/avatar

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