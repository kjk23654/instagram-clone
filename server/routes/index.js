// var express = require('express');
// var router = express.Router();
const express = require('express');
const router = express.Router();
const usersRouter = require('./users');
const auth = require("../auth/auth");


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

/* GET home page */ 
router.get('/', (req, res, next) => {
  res.json({ message: "hello client" });
});

// 유저 라우터
router.use("/users", usersRouter);

module.exports = router;
