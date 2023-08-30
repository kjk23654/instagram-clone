const express = require('express');
const router = express.Router();
const {
    feed,
    find,
    create,
    findOne,
    deleteOne,
    like,
    unlike
} = require("../controllers/postController");
const commentController = require('../controllers/commentController');
const upload = require("../utils/upload");


// post
router.get('/feed', feed);
router.get('/', find)
router.post('/', upload.array('photos', 10), create) // multer라는 미들웨어의 방식
// photos : 파일의 필드네임, 10 : 파일의 최대갯수 (넘어가면 에러 발생)
router.get('/:id', findOne);
router.delete('/:id', deleteOne);
router.post('/:id/like', like)
router.delete('/:id/unlike', unlike)

// comment -  양이 적어서 post와 같이 사용
router.get('/:id/comments', commentController.find);
router.post('/:id/comments', commentController.create);
router.delete('/comments/:id', commentController.deleteOne);

module.exports = router;