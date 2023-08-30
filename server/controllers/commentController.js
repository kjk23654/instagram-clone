const Post = require('../models/Post');
const Comment = require('../models/Comment');

// 댓글 가져오기
exports.find = async (req, res, next) => {};

// 댓글 생성
exports.create = async (req, res, next) => {
    try {
        // 댓글을 달 게시물을 검색한다
        const post = await Post.findById(req.params.id);

        // 게시물이 존재하지 않을 경우
        if (!post) {
            const err = new Error("Post is not found");
            err.status = 404;
            throw err;
        }

        // 게시물이 존재할 경우 댓글 생성
        const comment = new Comment({
            content : req.body.content,
            post : post._id,
            user : req.user._id // 댓글 작성자(로그인한 유저)
        })

        await comment.save();

        await comment.populate({
            path : 'user', // 작성자 정보
            select : 'username avatar avatarUrl' // select = 도큐먼트에서 특정 필드만 선택
        })

        res.json({ comment });

    } catch(error) {
        next(error)
    }
};

// 댓글 삭제
exports.deleteOne = async (req, res, next) => {};