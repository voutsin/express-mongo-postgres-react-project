import express from "express";
import PostController from "../controller/PostController.js";
import { deletePostValidations, findPostValidations, findUserPostsValidations } from "../validators/postValidator.js";
import { createMediaThumbnail, uploadMiddleware } from "../middleware/uploadMiddleware.js";
import { addActiveUserIdInReq } from "../common/utils.js";

const postsRouter = express.Router();

// find all posts - debug only
postsRouter.get('/all', PostController.findAllPosts);

// find single post by id
postsRouter.get('/single/:id?', findPostValidations, PostController.findPostById);

// find all posts of a user
postsRouter.get('/user', findUserPostsValidations, PostController.findAllUserPosts);

// add new post
postsRouter.post('/addNew', addActiveUserIdInReq, uploadMiddleware.single('media_url'), createMediaThumbnail, PostController.addNewPost);

// update post
postsRouter.put('/edit', addActiveUserIdInReq, uploadMiddleware.single('media_url'), createMediaThumbnail, PostController.updatePost);

// delete post
postsRouter.delete('/:id?', deletePostValidations, PostController.deletePost);

export default postsRouter;