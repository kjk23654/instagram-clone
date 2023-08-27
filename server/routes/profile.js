const express = require('express');
const router = express.Router();
const {
    find,
    findOne,
    follow,
    unfollow
} = require("../controllers/profileController");

router.get('/', find);
router.get('/:username', findOne);
router.post('/:username/follow', follow);
router.delete('/:username/unfollow', unfollow);

// 라우터와 컨트롤러를 연결한 것

module.exports = router;