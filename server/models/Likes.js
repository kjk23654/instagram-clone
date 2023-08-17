const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likesSchema = new Schema({
    user : { type : Schema.ObjectId, required : true }, // 좋아요 한 유저
    post : { type : Schema.ObjectId, required : true } // 좋아요 한 게시물
}, {
    toJSON : { virtuals : true},
    toObject : { virtuals : true}
})

module.exports = mongoose.model('Likes', likesSchema)