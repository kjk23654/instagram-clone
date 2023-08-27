// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });



// module.exports = router;

/* ===================================================*/

// 필요한 모듈 import
const express = require('express'); 


const router = express.Router(); // 라우터
const {
  create,
  login,
  update
} = require("../controllers/userController"); // 유저 컨트롤러


const signUpValidator = require('../utils/signUpValidator'); // 회원가입 폼 유효성 검사 미들웨어
const loginValidator = require('../utils/loginValidator'); // 로그인 유효성 검사 미들웨어
const upload = require("../utils/upload"); // 파일 처리 미들웨어
const auth = require("../auth/auth"); // 인증처리 미들웨어

// 라우팅

/*
  HTTP 요청 메서드

  1. GET
  데이터 읽기 요청
  2. POST
  데이터 생성 요청
  3. PUT
  데이터 수정 요청
  4. DELETE
  데이터 삭제 요청
*/



// router.HttpRequestMethod(요청주소, 미들웨어, 컨트롤러);
// put과 post가 요청메서드(RequestMethod)
router.post('/', signUpValidator, create);
router.post('/login', loginValidator, login);
router.put('/user', auth, upload.single('avatar'), update);
// router.put('/user', auth, upload.single('avatar'), update);는 
// 미들웨어가 2개 사용됨(auth, upload.single('avatar'));
// 미들웨어는 갯수제한이 없고 차례대로 실행됨.

module.exports = router;