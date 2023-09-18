const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');
const Comment = require('./Comment');

// 포스트 스키마
const postSchema = new Schema({
    
    photos : [{ type : String, required : true}], // 사진의 이름
    caption : { type : String}, // 사진에 대한 설명
    user : { type : Schema.ObjectId, required : true, ref : 'User'}, // 게시물 작성자(User 모델과 조인한다)
    likesCount : { type : Number, default : 0}, // 좋아요 갯수
}, {
    timestamps : true,
    toJSON : { virtuals : true},
    toObject : { virtuals : true}
})

// 가상 필드

// 1. 보여주기용 날짜(날짜를 가공해서 사용자가 보기 편하게 만들어주는 것)
postSchema.virtual('displayDate').get(function() {
    const displayDate = DateTime
    .fromJSDate(this.createdAt) 
    // this.createdAt : DB에 저장되는 생성일
    .toLocaleString(DateTime.DATE_MED);

    return displayDate;
})

// 2. 사진 URL
postSchema.virtual('photoUrls').get(function () {
    const urls = this.photos.map(photoName => {
        return process.env.FILE_URL + '/photos/' + photoName
        // process.env.FILE_URL : 환경변수에 저장된 이름
    })

    return urls;
})

// 3. 댓글의 갯수
postSchema.virtual('commentCount', { // 컬렉션 조인
    ref : 'Comment', // Comment 모델과 조인
    localField : '_id',
    foreignField : 'post',
    count : true
})

// 4. 좋아요 여부
postSchema.virtual('liked', {
    ref : 'Likes', // Likes 모델과 조인
    localField :'_id',
    foreignField : 'post',
    justOne : true
})

module.exports = mongoose.model('Post', postSchema); // model() : 모델을 생성함(첫번째 인자를 이름으로 해서 2번째 인자값)