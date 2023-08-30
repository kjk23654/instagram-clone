const User = require('../models/User');
const Following = require('../models/Following');
const Post = require('../models/Post');
const Likes = require('../models/Likes');
const { listenerCount } = require('../models/Comment');

// 피드 가져오기
exports.feed = async (req, res, next) => {
    try {
        // 팔로잉 컬렉션 검색
        const followingUsers = await Following.find({ user : req.user._id});
        const followingIds = followingUsers
            .map(followingUser => followingUser.following);

        // 검색 조건 : 로그인 유저가 팔로우하는 유저와 본인의 게시물만 검색한다.
        const where = { user : [...followingIds, req.user._id] }
        // limit과 skip
        const limit = req.query.limit || 5;
        // req.query에 리밋이 있으면 그 리밋을 사용하고 없으면 5로 지정
        const skip = req.query.skip || 0;
        // req.query가 스킵을 지정하면 그 스킵을 사용하고 없으면 0으로 지정

        // 조건에 맞는 도큐먼트를 검색한다
        const posts = await Post.find(where)
            .populate({ // 컬렉션 조인 - 기존 데이터를 조합하여 데이터를 더 풍부하게 만듦
                path: 'user', // 게시물 작성자에 대한 정보
                // path는 필드
                select : 'username avatar avatarUrl' // 추가할 필드
            })
            .populate('commentCount') // 댓글의 갯수
            .populate({
                path : 'liked', // 좋아요 여부
                match : { user : req.user._id }
            })
            .sort({ createdAt : 'desc' }) // 정렬(sort). 인자는 정렬의 조건(생성일기준 내림차순)
            .skip(skip) 
            .limit(limit)

        const postCount = await Post.count(where); // 조건에 해당하는 도큐먼트 갯수

        res.json({ posts, postCount }); // 서버의 응답

    } catch(error) {
        next(error)
    }
};

// 게시물 리스트 가져오기
exports.find = async(req, res, next) => {
    try {
        // 검색조건으로 활용할 객체
        const where = {};

        // 클라이언트가 특정 유저의 게시물만 요청한 경우 (타임라인)
        if('username' in req.query) { // query 안에 username이 있을 경우
            // 전송받은 유저이름으로 유저를 검색한다.
            const user = await User.findOne({ username : req.query.username }); // 조건에 맞는 1개의 도큐먼트를 검색

            // 유저가 존재하지 않을 경우
            if(!user) {
                const err = new Error("User is not found");
                err.status = 404;
                throw err;
            }

            // 조건을 추가한다.
            where.user = user._id;
        }

        // 검색
        const posts = await Post
            .find(where)
            .populate('commentCount') // 댓글 갯수 파악
            .sort({ createdAt : 'desc' }) // 생성일 기준 내림차순 정렬

        const postCount = await Post.count(where); // 게시물 갯수

        res.json({ posts, postCount });

    } catch(error) {
        next(error)
    }
};

// 게시물 한개 가져오기
exports.findOne = async(req, res, next) => {
    try {
        
        // 파라미터 아이디로 게시물을 검색한다
        const post = await Post.findById(req.params.id) // 아이디로 한개의 도큐먼트 검색
            .populate({ // 컬렉션 조인
                path : 'user', // 작성자 정보
                select : 'username avatar avatarUrl' 
            })
            .populate('commentCount') // 댓글 갯수
            .populate({ // 좋아요 여부
                path : 'liked',
                match : { user : req.user._id}
            })

            // 게시물이 존재하지 않을 경우
            if(!post) {
                const err = new Error('Post is not found');
                err.status = 404;
                throw err;
            }

            res.json({ post }); // 서버의 응답

    } catch(error) {
        next(error);
    }
};

// 게시물 생성
exports.create = async (req, res, next) => {
    try {

        // req.files : 클라이언트가 전송한 파일(이미지, 사진). 파일이 이상하면
        // 파일 처리 미들웨어에서 에러를 처리
        // post.js : upload.array('photos')보면 파일이 한 개 이상
        const files = req.files;


        // 파일이 없을 경우
        if(!files || files.length < 1) { // 인스타그램은 사진이 필수. 
            const err = new Error('File is required');
            err.status = 400;
            throw err;
        }

        // 도큐먼트를 생성하기 전 파일의 이름을 추출
        const photoNames = files.map(file => file.filename);

        // 도큐먼트 생성
        const post = new Post({
            photos : photoNames, // 파일의 이름
            caption : req.body.caption, // 사진에 대한 설명
            user : req.user._id // 게시물 작성자는 로그인 유저의 아이디를 저장
        });

        await post.save();

        res.json({ post });


    } catch(error) {
        next(error)
    }
};

// 게시물 삭제
exports.deleteOne = async (req, res, next) => {
    try {

        // 삭제할 게시물을 검색한다
        const post = await Post.findById(req.params.id);

        // 게시물이 존재하지 않는 경우
        if(!post) {
            const err = new Error('Post is not found');
            err.status = 404;
            throw err;
        }

        // 본인의 게시물인지 확인
        const isMaster = req.user._id.toString() === post.user.toString();
        // req.user의 아이디와 post.user의 아이디를 비교하고 있으며
        // 일치하는지 확인.
        // 일치한다는 건 본인의 게시물이라는 것.
        // 복사한 객체가 아닌 이상 비교할 수 없기 때문에 문자열로 바꿔서 비교하는 것

        // 본인의 게시물이 아닌 경우
        if (!isMaster) {
            const err = new Error('Incorrect user');
            err.status = 400;
            throw err;
        }

        await post.deleteOne();

        res.json({ post });

    } catch(error) {
        next(error)
    }
};

// 좋아요
exports.like = async (req, res, next) => {
    try {
        // 좋아요할 게시물을 검색한다
        const post = await Post.findById(req.params.id);

        // 게시물이 존재하지 않을 경우
        if(!post) {
            const err = new Error('Post is not found');
            err.status = 404;
            throw err;
        }


        // 이미 좋아요한 게시물인지 확인
        const liked = await Likes
            .findOne({ user : req.user._id, post : post._id });

        
        // 처음 좋아요하는 게시물일 경우
        if (!liked) {
            // 도큐먼트 생성
            const likes = new Likes({ 
                user : req.user._id,
                post : post._id
            })

            await likes.save();

            // 게시물의 좋아요를 1 증가시킨다.
            post.likesCount++; // 위에서 검색한 post

            // 변경사항 저장
            await post.save();
        }

        res.json({ post });

    } catch(error) {
        next(error)
    }
};

// 좋아요 취소
exports.unlike = async (req, res, next) => {
    try {
        // 좋아요를 취소할 게시물 검색
        const post = await Post.findById(req.params.id)

        // 게시물이 존재하지 않을 경우 404 에러 처리
        if(!post) {
            const err = new Error('Post is not found')
            err.status = 404;
            throw err;
        }

        // 좋아요한 게시물인지 확인
        const liked = await Likes
            .findOne({ user : req.user._id, post : post._id });

        // 좋아요한 게시물이 맞는 경우 취소 처리    
        if (liked) {
            await liked.deleteOne();

            // 게시물의 좋아요갯수를 1 감소시킨다
            post.likesCount--;

            // 변경사항 저장
            await post.save();
        }

        res.json({ post }); // 서버의 응답 => 이거 삭제하면 계속 로딩상태가 됨.

    } catch(error) {
        next(error)
    }
}