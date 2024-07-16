import express from "express";
import CommentController from "../controller/CommentController.js";
import { addNewCommentValidations, addNewReplyValidations, deleteCommentValidations, updateCommentValidations, viewCommentRepliesValidations, viewCommentValidations, viewPostCommentsValidations } from "../validators/commentsValidator.js";
import { addActiveUserIdInReq } from "../common/utils.js";

const commentsRouter = express.Router();

// find all comments of a post
commentsRouter.get('/post', viewPostCommentsValidations, CommentController.findAllPostComments);

// find all replies in a comment
commentsRouter.get('/replies', viewCommentRepliesValidations, CommentController.findAllCommentReplies);

// add new comment
commentsRouter.post('/addNew',  addActiveUserIdInReq, addNewCommentValidations, CommentController.addNewComment);

// delete comment
commentsRouter.delete('/:id?',  addActiveUserIdInReq, deleteCommentValidations, CommentController.deleteComment);

// update comment
commentsRouter.put('/edit',  addActiveUserIdInReq, updateCommentValidations, CommentController.updateComment);

// view detailed comment - for view from notifications
commentsRouter.get('/:id?',  addActiveUserIdInReq, viewCommentValidations, CommentController.viewDetailedComment);

// add reply to comment
commentsRouter.post('/reply/addNew', addActiveUserIdInReq, addNewReplyValidations, CommentController.addReply);

export default commentsRouter;