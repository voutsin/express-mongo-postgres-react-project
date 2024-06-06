import express from "express";
import PostController from "../controller/PostController.js";
import { deletePostValidations, findPostValidations, findUserFeedValidations, findUserPostsValidations } from "../validators/postValidator.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import { addActiveUserIdInReq } from "../common/utils.js";

const postsRouter = express.Router();

// find all posts - debug only
postsRouter.get('/', PostController.findAllPosts);

// find single post by id
postsRouter.get('/:id?', findPostValidations, PostController.findPostById);

// find all posts of a friend or active user
postsRouter.get('/user/:id?', findUserPostsValidations, PostController.findAllUserPosts);

// add new post
postsRouter.post('/addNew', addActiveUserIdInReq, uploadMiddleware.single('media_url'), PostController.addNewPost);

// update post
postsRouter.put('/edit', addActiveUserIdInReq, uploadMiddleware.single('media_url'), PostController.updatePost);

// delete post
postsRouter.delete('/:id?', deletePostValidations, PostController.deletePost);

// get feed of a user -- all posts and reactions of friends sorted by created timestamp
postsRouter.get('/user/feed/:id?', findUserFeedValidations, PostController.findUserPostFeed);

export default postsRouter;