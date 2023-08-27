// var express = require('express');
// var router = express.Router();


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

/* ============================================= */

const express = require('express');
const router = express.Router();
const usersRouter = require('./users');
const profileRouter = require("./profile");
const auth = require("../auth/auth");


/* GET home page */ 
router.get('/', function(req, res, next) {
  res.json({ message: "hello client" });
});
// 클라이언트가 서버에 요청을 성공하면 서버가 hello client를 응답


// 유저 라우터
router.use("/users", usersRouter);
// /users라는 요청이 있을 때는 userRouter가 처리한다는 의미

// 프로필 라우터
router.use("/profiles", auth, profileRouter);

module.exports = router;
