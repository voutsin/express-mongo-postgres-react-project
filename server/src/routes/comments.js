import express from "express";
import CommentController from "../controller/CommentController.js";
import { addNewCommentValidations, deleteCommentValidations, updateCommentValidations, viewCommentVlidations } from "../validators/commentsValidator.js";
import { addActiveUserIdInReq } from "../common/utils.js";

const commentsRouter = express.Router();

// find all comments - debug only
commentsRouter.get('/', CommentController.findAllComments);

// add new comment
commentsRouter.post('/addNew',  addActiveUserIdInReq, addNewCommentValidations, CommentController.addNewComment);

// delete comment
commentsRouter.delete('/:id?',  addActiveUserIdInReq, deleteCommentValidations, CommentController.deleteComment);

// update comment
commentsRouter.put('/edit',  addActiveUserIdInReq, updateCommentValidations, CommentController.updateComment);

// view detailed comment - for view from notifications
commentsRouter.get('/:id?',  addActiveUserIdInReq, viewCommentVlidations, CommentController.viewDetailedComment);


export default commentsRouter;