const User = require("../models/User");

// 유저 생성
exports.create = async (req, res, next) => { // 요청 객체와 응답 객체에 접근
    try {
        // 유저가 전송한 데이터는 요청 body에 담긴다.
        const { email, name, username, password} = req.body;

        // 유저 도큐먼트 생성
        const user = new User();

        user.email = email;
        user.name = name;
        user.username = username;
        user.setPassword(password); // 비밀번호 암호화 (모델에서 제공하는 오퍼레이션)

        await user.save();

        res.json({ user });

    } catch (error) {
        next(error)
    }
};

// 로그인
exports.login = async (req, res, next) => {
    try {
        // 유저가 로그인 시에 입력한 이메일
        const { email } = req.body;

        // 이메일로 유저 검색
        const _user = await User.findOne({ email });

        // 로그인 토큰 생성
        const access_token = _user.generateJWT(); // 오퍼레이션 = 자바의 메서드

        // 로그인 유저 프로필 데이터와 로그인 토큰
        const user = {
            username : _user.username,
            name : _user.name,
            avatarUrl : _user.avatarUrl,
            bio : _user.bio,
            access_token
        }

        res.json({ user }); // 서버의 응답


    } catch(error) {
        next(error)
    }
};

// 프로필 수정
exports.update = async (req, res, next) => {};
