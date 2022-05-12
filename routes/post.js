const express = require('express');
const router = express.Router();

const usersCtrl = require("../controllers/user")
const postCtrl = require('../controllers/post');

const authentification = require('../middleware/authentification');
const multer = require('../middleware/multer');

//-------------------recupereration---------------
router.get('/posts',postCtrl.getAllPosts);
router.post('/comments', postCtrl.getOneComment);
router.get('/users', usersCtrl.getAllUsers);

// router.post('/', usersCtrl.userSignup);
// router.put('/post', usersCtrl.login);

//-------------------Create post/comment---------------
router.post('/post', multer,postCtrl.getOneComment);
router.post('/post/comments',multer, postCtrl.createComment);

//-------------------Recuper un post---------------
router.post('/post/:id',postCtrl.getOnePost);
router.put('/post/:id/modify',postCtrl.updatePost)
router.post('/post/:id',postCtrl.getOnePost)
router.post('/upload/',multer,postCtrl.createPost);
// router.post('/',authentification,multer, saucesCtrl.createSauce);
// router.put('/:id',authentification,multer, saucesCtrl.modifySauce);
router.post('/delete', postCtrl.deletePost);
// router.post('/:id/like' ,authentification,saucesCtrl.likeDislike);

module.exports = router;