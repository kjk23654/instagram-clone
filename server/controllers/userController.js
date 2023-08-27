const User = require("../models/User");
// 컨트롤러는 모델과 통신하기 때문에 모델을 import해줌

// 유저 생성
exports.create = async (req, res, next) => { // 요청 객체와 응답 객체에 접근
    try {
        // 유저가 전송한 데이터는 요청 body에 담긴다.
        const { email, name, username, password} = req.body;

        // 유저 도큐먼트 생성(인스턴스 -> 값을 할당 => save 메서드)
        const user = new User();

        user.email = email;
        user.name = name;
        user.username = username;
        user.setPassword(password); // 비밀번호 암호화 (모델에서 제공하는 오퍼레이션)

        await user.save();

        res.json({ user }); // 생성완료후 클라이언트에게 답을 해주는 것.

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

        // 로그인 유저 프로필 데이터와 로그인 토큰(민감한 데이터는 제외됨)
        const user = {
            username : _user.username,
            name : _user.name,
            avatarUrl : _user.avatarUrl,
            bio : _user.bio,
            access_token
        }

        res.json({ user }); // 서버의 응답
        // 서버가 user 객체를 클라이언트한테 전송해줌

    } catch(error) {
        next(error)
    }
};

// 프로필 수정
exports.update = async (req, res, next) => {

    try {
        // req.user : 로그인 유저
        const _user = req.user; // req 객체의 user속성 
        // passport가 인증에 성공하였을 경우 request의 유저 정보를 저장
        // auth는 첫번째 미들웨어

        // 파일 업로드가 있는 경우
        if(req.file) { // req.file : 유저가 업로드한 파일(파일처리 미들웨어)
            _user.avatar = req.file.filename;
        }

        // 이름 수정 요청이 있는 경우
        if ('name' in req.body) {
            _user.name = req.body.name;
        }

        // 자기소개 수정 요청이 있는 경우
        if ('bio' in req.body) {
            _user.bio = req.body.bio;
        }

        await _user.save(); // 변경사항을 저장한다

        // 토큰 재발급
        const access_token = _user.generateJWT();
        // 토큰 재발급을 하는 이유 = 브라우저에서 유저데이터를 동기화해야함.

        // 유저데이터 전송
        const user =  {
            username : _user.username, 
            name : _user.name,
            avatarUrl : _user.avatarUrl,
            bio : _user.bio,
            access_token
        }

        res.json({ user }) // 서버의 응답. json 메서드의 인자(=user) : 전송하는 데이터

    } catch(error) {
        next(error);
    }
};
