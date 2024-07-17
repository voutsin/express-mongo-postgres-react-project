import express from "express";
import MessageController from "../controller/MessageController.js";
import { addActiveUserIdInReq } from "../common/utils.js";
import { findGroupValidations } from "../validators/messageValidator.js";

const messagesRouter = express.Router();

messagesRouter.get('/groups', addActiveUserIdInReq, MessageController.findAllUserGroups);

messagesRouter.delete('/groups/:id?', addActiveUserIdInReq, findGroupValidations, MessageController.deleteGroupById);

export default messagesRouter;