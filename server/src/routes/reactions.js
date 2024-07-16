import express from "express";
import ReactionController from "../controller/ReactionController.js";
import { addActiveUserIdInReq, fetchReactionMiddleware } from "../common/utils.js";
import { addNewReactionValidations, deleteReactionValidations, updateReactionValidations, viewReactionValidations } from "../validators/reactionValidator.js";
import { findPostValidations } from "../validators/postValidator.js";
import { viewCommentValidations } from "../validators/commentsValidator.js";

const reactionsRouter = express.Router();

// find all post reactions
reactionsRouter.get('/post/:id?', addActiveUserIdInReq, findPostValidations, ReactionController.findAllPostReactions);

// find all comment reactions
reactionsRouter.get('/comment/:id?', addActiveUserIdInReq, viewCommentValidations, ReactionController.findAllCommentReactions);

// add new reaction
reactionsRouter.post('/addNew', addActiveUserIdInReq, fetchReactionMiddleware, addNewReactionValidations, ReactionController.addNewReaction);

// update reaction
reactionsRouter.put('/edit', addActiveUserIdInReq, updateReactionValidations, ReactionController.updateReaction);

// delete reaction
reactionsRouter.delete('/:id?', addActiveUserIdInReq, deleteReactionValidations, ReactionController.deleteReaction);

// view reaction - for notification
reactionsRouter.get('/:id?', addActiveUserIdInReq, viewReactionValidations, ReactionController.viewReaction);

export default reactionsRouter;