const User = require("../models/User");
const Following = require("../models/Following");

// 프로필 목록
exports.find = async (req, res, next) => {
    try {
        // 검색 조건을 저장할 객체
        const where = {}

        // 특정유저가 팔로우하는 프로필 목록
        if("following" in req.query) {
            // 쿼리에 담긴 정보로 유저를 검색한다(특정 유저를 찾기 위해)
            const user = await User
            .findOne({ username : req.query.following });
            // 모델에서 1개의 도큐먼트를 찾음
            // findOne의 인자는 검색조건

            // 유저가 존재하지 않을 경우
            if(!user) {
                const err = new Error("User is not found");
                err.status = 404;
                throw err;
            }

            // 팔로잉 컬렉션 검색
            const followingUsers = await Following
                .find({ user: user._id })

            // 도큐먼트에서 following필드만 추출한 데이터
            const followingIds = followingUsers
                .map(followingUser => followingUser.following);

            // 검색조건을 추가한다
            where._id = followingIds;
        }

        // 특정 유저의 팔로워 리스트
        if ('followers' in req.query) {
            // 쿼리에 저장된 값으로 유저를 검색한다
            const user = await User
                .findOne({ username : req.query.followers });

            // 유저가 존재하지 않는 경우 404에러 처리(클라이언트가 요청한 정보가 서버에 없을 때)
            if(!user) {
                const err = new Error("User is not found");
                err.status = 404;
                throw err;
            }

            // 팔로잉 컬렉션을 검색한다
            const followers = await Following
                .find({ following : user._id}); // 팔로잉 필드가 검색한 유저의 id

            const followerIds = followers.map(follower => follower.user);

            // 검색 조건을 추가한다.
            where._id = followerIds;
        }

        // 특정 문자를 포함한 프로필 리스트
        if ('username' in req.query) {
            // 정규식(Regular expression)을 사용한다.
            // 정규식 = 문자열을 검색할 때 검색패턴을 제공
            const patt = new RegExp(req.query.username, 'i'); 

            where.username = patt; // 유저이름이 기준
        }

        // 프로필 필드
        const profileFields = 'username name avatar avatarUrl bio';

        // 검색 실행(DB에 쿼리를 전송)
        const profiles = await User // Model.find(검색조건, 필드)
            .find(where, profileFields)
            .populate({ // 컬렉션 조인 실행(선언은 모델(User.js)에 해놓음(isFollowing))
                path : 'isFollowing',
                match : { user : req.user._id}
                // 뉴진스를 팔로우한 사람을 찾고, 그 안에서 태민을 찾음
            })

        // 프로필 갯수를 구한다
        const profileCount = await User.count(where);

        res.json({ profiles, profileCount });

    } catch(error) {
        next(error);
    }
};

// 프로필 상세보기
exports.findOne = async (req, res, next) => {

    try {
        // 프로필 필드
        const profileFields = "username name avatar avatarUrl bio";

        // 프로필 검색
        const profile = await User
            .findOne({ username : req.params.username }, profileFields)
            // 클라이언트가 parameter로 전송한 username을 가지고 검색
            .populate('postCount') // 컬렉션 조인 실행
            .populate('followerCount')
            .populate('followingCount')
            .populate({
                path : 'isFollowing',
                match : { user: req.user._id}
            })

        // 프로필이 존재하지 않는 경우
        if(!profile) { 
            const err = new Error("Profile is not found");
            err.status = 404;
            throw err;
        }

        res.json({ profile });

    } catch(error) {
        next(error);
    }
};

// 팔로우
exports.follow = async (req, res, next) => {
    try {
        // 프로필 필드(User 도큐먼트에서 프로필 필드에 해당하는 부분만 가져옴)
        const profileFields = 'username name avatar avatarUrl bio';

        // 파라미터로 전달된 유저이름(username)으로 유저를 검색한다
        // 파라미터는 클라이언트가 서버에 전송함
        const profile = await User
            .findOne({ username : req.params.username }, profileFields)
            

        // 유저가 존재하지 않을 경우
        // 클라이언트가 요청할 리소스를 서버가 없을 때 404 처리
        if (!profile) {
            const err = new Error('Profile is not found')
            err.status = 404;
            throw err;
        }

        // req.user : 토큰을 기반으로 검색한 유저(=로그인 유저)
        // req.params.username : 로그인유저가 팔로우를 요청한 유저
        if (req.user.username === req.params.username) {
            // 본인을 팔로우하는 경우
            const err = new Error('Cannot follow yourself')
            err.status = 400;
            throw err;
        }

        // 이미 팔로우 상태인지 확인한다. 
        const isFollowing = await Following
            .findOne({ user : req.user._id, following : profile._id});

        // 팔로우상태가 아닌 경우 : 팔로우처리를 해야함
        if (!isFollowing) {
            const following = new Following({
                user : req.user._id, // 도큐먼트의 아이디
                following : profile._id
            })

            await following.save();
        }

        // 서버의 응답
        res.json({ profile });

    } catch(error) {
        next(error)
    }
};

// 팔로우 취소
exports.unfollow = async (req, res, next) => {
    try {
        const profileFields = 'username name avatar avatarUrl bio';

        // 팔로우를 취소할 프로필을 검색한다.
        const profile = await User
            .findOne({ username : req.params.username }, profileFields)
            // 클라이언트가 파라미터로 팔로우를 취소할 username을 전송
        
        // 프로필이 존재하지 않은 경우
        if(!profile) {
            const err = new Error('Profile is not found')
            err.status = 404;
            throw err;
        }

        // 현재 프로필 유저를 팔로우 중인지 확인
        const isFollowing = await Following
            .findOne({ user: req.user._id, following : profile._id });

        // 팔로우 중이 맞다면 팔로우를 취소한다.
        if (isFollowing) {
            // deleteOne : 한 개의 도큐먼트를 삭제한다
            await isFollowing.deleteOne();
        }

        res.json({ profile });

    } catch(error) {
        next(error)
    }
};