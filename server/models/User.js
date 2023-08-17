const mongoose = require('mongoose'); // DB 연결
const Schema = mongoose.Schema; 
const jwt = require("jsonwebtoken"); // jwt = jsonWebToken
// require() = import의 구버전
const crypto = require("crypto"); // 암호화 관련

// 유저스키마 (유저 모델의 구조)
const userSchema = new Schema({
    email : { type : String, minLength : 5}, // minLength : 최소길이
    password : { type : String, minLength : 5},
    salt : {type : String}, 
    username : { type : String, minLength : 3, required : true}, // required : 필수 여부
    name : { type : String}, 
    avatar : { type : String, default : 'default.png'}, // 유저의 프로필. default : 기본값
    bio : { type : String} // 자기소개
}, {
    toJSON : { virtuals : true}, // virtual 필드(가상 필드)
    toObject : { virtuals : true}
})

// 가상필드 추가 (Virtual field)
// 기존의 데이터를 가공하여 새로운 필드를 생성할 수 있다

// 1. 아바타 URL
// 생성 목적 = 클라이언트가 아바타를 쉽게 찾을 수 있게 한다.
userSchema.virtual('avatarUrl').get(function() {
    return process.env.FILE_URL + '/avatar/' + this.avatar
})

// 2. 유저의 게시물 갯수 파악
userSchema.virtual('postCount', { // 컬렉션 조인(join)
    ref : 'Post', // Post 모델과 조인한다. (ref = reference = 참조한다)
    localField : '_id', // 기본키 - 조인의 기준
    foreignField : 'user', // 외래키 - 조인의 기준
    count : true 
})

// 3. 유저의 팔로워 숫자 파악
userSchema.virtual('followerCount', { // 객체를 직접 넣은 케이스. 변수를 따로 초기화한 후 변수를 넣어도 됨.
    ref : 'Following', // Following 모델과 조인
    localField : '_id',
    foreignField : 'following',
    count : true
})

// 4. 유저의 팔로잉 숫자 파악
userSchema.virtual('followingCount', {
    ref : 'Following', // Following 모델과 조인
    localField : '_id', 
    foreignField : 'user', 
    count : true
})

// 5. 해당 유저의 팔로잉 여부 파악
userSchema.virtual('isFollowing', {
    ref : 'Following', // Following 모델과 조인
    localField : '_id', 
    foreignField : 'following',
    justOne : true
})


// 오퍼레이션(Operations) - 모델의 데이터 처리 기능(= 함수)
// 모델 다이어그램의 setPassword(), checkPassword() 등 메서드

// 1. 비밀번호 암호화
userSchema.methods.setPassword = function(password) {
    this.salt = crypto // salt = 암호화에 사용되는 키. crypto = 모듈(암호화 관련 패키지)
    .randomBytes(16).toString("hex");

    // 비밀번호 암호화
    this.password = crypto
    .pbkdf2Sync(password, this.salt, 310000, 32, "sha256") // pbkdf2, sha256 : 알고리즘
    .toString("hex");
}

// 2. 비밀번호 검사
userSchema.methods.checkPassword = function (password) {
    // 로그인 시에 호출되는 오퍼레이션

    // 로그인 시에 입력한 비밀번호를 유저의 salt로 다시 암호화한다.
    // salt 로그인 시에 비밀번호를 검사하기 위해서 
    const hashedPassword = crypto
    .pbkdf2Sync(password, this.salt, 310000, 32, "sha256")
    .toString("hex")

    return this.password === hashedPassword;
}

// 3. 로그인 토큰 생성
userSchema.methods.generateJWT = function() {
    const payload = { // 유저의 데이터
        sub : this._id,
        username : this.username
    }

    const secret = process.env.SECRET; // 토큰 생성에 사용되는 키

    return jwt.sign(payload, secret);
}

module.exports = mongoose.model('User', userSchema);