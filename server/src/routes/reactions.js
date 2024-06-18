import express from "express";
import ReactionController from "../controller/ReactionController.js";
import { addActiveUserIdInReq, fetchReactionMiddleware } from "../common/utils.js";
import { addNewReactionValidations, deleteReactionValidations, updateReactionValidations, viewReactionValidations } from "../validators/reactionValidator.js";

const reactionsRouter = express.Router();

// find all reactions
reactionsRouter.get('/', addActiveUserIdInReq, ReactionController.findAllReactions);

// add new reaction
reactionsRouter.post('/addNew', addActiveUserIdInReq, fetchReactionMiddleware, addNewReactionValidations, ReactionController.addNewReaction);

// update reaction
reactionsRouter.put('/edit', addActiveUserIdInReq, updateReactionValidations, ReactionController.updateReaction);

// delete reaction
reactionsRouter.delete('/:id?', addActiveUserIdInReq, deleteReactionValidations, ReactionController.deleteReaction);

// view reaction - for notification
reactionsRouter.get('/:id?', addActiveUserIdInReq, viewReactionValidations, ReactionController.viewReaction);

export default reactionsRouter;