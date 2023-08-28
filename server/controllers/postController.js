const User = require('../models/User');
const Following = require('../models/Following');
const Post = require('../models/Post');
const Likes = require('../models/Likes');

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
exports.find = async(req, res, next) => {};

// 게시물 한개 가져오기
exports.findOne = async(req, res, next) => {};

// 게시물 생성
exports.create = async (req, res, next) => {};

// 게시물 삭제
exports.deleteOne = async (req, res, next) => {};

// 좋아요
exports.like = async (req, res, next) => {};

// 좋아요 취소
exports.unlike = async (req, res, next) => {}