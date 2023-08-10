// 설치한 패키지 임포트
const express = require("express");
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const indexRouter = require('./routes/index');
const app = express();
const mongoose = require('mongoose');
const compression = require('compression');
const helmet = require('helmet');
require('dotenv').config();

// require() : es5에 사용하는 import 문법
// express는 아직 es6를 공식적으로 지원하지 않기 때문에 es5 문법을 사용한 것.

// 데이터베이스 연결
mongoose.set('strictQuery', false); // strictQuery : key, false : value
mongoose
    .connect(process.env.MONGODB_URI)
    .catch(err => console.log(err));


// 미들웨어 적용 (클라이언트와 서버 사이에서 일을 하는 패키지 - 요청과 응답 사이에서 기타 작업을 수행)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended : false }));
app.use(cookieParser());
app.use(compression());
app.use(helmet.crossOriginResourcePolicy({
    policy : "cross-origin"
}));
app.use(cors());

// 파일 저장 경로 설정
app.use('/api/static', express.static('public'));
app.use('/api/files', express.static('files'));

// 라우터 호출 및 prefix 설정
app.use('/api', indexRouter);

// 404 에러 처리
app.use((req, res, next) => {
    next(createError(404));
})

// 에러 핸들러(Handler)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json(err);
})

module.exports = app;