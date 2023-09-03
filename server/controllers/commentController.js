const Post = require('../models/Post');
const Comment = require('../models/Comment');

// 댓글 가져오기
exports.find = async (req, res, next) => {
    try {
        // 댓글을 가져올 게시물을 검색한다.
        const post = await Post.findById(req.params.id);

        // 게시물이 존재하지 않는 경우
        if (!post) {
            const err = new Error("Post is not found")
            err.status = 404;
            throw err;
        }

        // 검색 조건 : 댓글 도큐먼트에서 post 필드가 방금 검색한 게시물 아이디
        const where = { post : post._id };

        // 검색
        const comments = await Comment
            .find(where) // 게사물이 달린 댓글을 모두 가져옴
            .populate({ // 컬렉션 조인
                path : 'user', // 게시물 작성자에 대한 정보
                select : 'username avatar avatarUrl'
            })
            .sort({ createdAt : 'desc' })

        const commentCount = await Comment.count(where); // 도큐먼트 갯수 파악

        res.json({ comments, commentCount }); // 서버의 응답

    } catch(error) {
        next(error)
    }
};

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
exports.deleteOne = async (req, res, next) => {
    try {
        // 삭제할 댓글을 검색한다.
        const comment = await Comment.findById(req.params.id);

        // 댓글이 존재하지 않는 경우
        if (!comment) {
            const err = new Error("Comment is not found");
            err.status = 404;
            throw err;
        }

        // req.user = 로그인한 유저
        // comment.user = 댓글을 작성한 유저
        // 요청한 유저가 댓글의 작성자인지 확인
        const isMaster = req.user._id.toString() === comment.user.toString();
        // id는 Object id라는 타입이기 때문에 객체.
        // 객체끼리 비교는 안되기 때문에 문자열로 바꿔서 비교

        // 작성자가 아닌 경우
        if(!isMaster) {
            const err = new Error('Incorrect user');
            err.status = 400;
            throw err;
        }

        // 댓글 삭제
        await comment.deleteOne();

        res.json({ comment }); // 서버의 응답

    } catch(error) {
        next(error)
    }
};