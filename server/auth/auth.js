const JwtSrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const passport = require("passport");
const { Strategy } = require('passport-jwt');
require('dotenv').config();

// 토큰 처리전략 생성에 필요한 옵션
const opts = {};

// 로그인에 성공하면 서버는 토큰을 전송
// 브라우저는 헤더에 토큰을 같이 담아서 보내줌
// 요청 헤더에서 토큰을 추출하는 것과 관련된 옵션
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // jwtFromRequest : 요청으로부터 jwt 추출
// 토큰 해독에 필요한 키
opts.secretOrKey = process.env.SECRET;

// 토큰 처리전략 생성
const jwtStrategy = new Strategy(opts, async (payload, done) => { // 생성자 함수에 인자가 2개 들어감(opts, 콜백)
    try {
        // 페이로드에 저장된 id를 가지고 유저를 검색한다
        // 페이로드에 유저 데이터가 저장되어 있음(접근하는 페이로드는 해독이 된 상태)
        const user = await User.findById(payload.sub);
        // User.findById() : User 컬렉션에서 해당 id를 가진 유저를 검색한다
        // 몽고DB는 테이블을 컬렉션이라 함

        // 인증 실패
        if(!user) { // user === false
            return done(null, false);
        }

        // 인증 성공
        return done(null, user);

    } catch(err) {
        return done(err, false);
    }
})

passport.use(jwtStrategy); // 토큰 처리전략 적용

module.exports = passport.authenticate("jwt", { session : false });