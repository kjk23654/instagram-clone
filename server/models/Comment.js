const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const commentSchema = new Schema({
    content : { type : String}, // 댓글의 내용
    post : { type : Schema.ObjectId, required : true}, // 댓글이 달린 게시물
    user : { type : Schema.ObjectId, required : true, ref : 'User'} // 댓글 작성자
}, {
    timestamps : true, // document의 생성일(createdAt)과 수정일(UpdatedAt) 필드를 생성
    toJSON : { virtuals : true},
    toObject : { virtuals : true}
})

// 가상 필드

// 보여주기용 날짜(=날짜 가공. 데이터 같은 날짜를 사용자가 보기 좋게 변환)
commentSchema.virtual('displayDate').get(function() { 
    const displayDate = DateTime
    .fromJSDate(this.createdAt)
    .toLocaleString(DateTime.DATETIME_MED);

    return displayDate;
})

module.exports = mongoose.model('Comment', commentSchema);