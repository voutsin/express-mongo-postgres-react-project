import express from "express";
import MessageController from "../controller/MessageController.js";
const messagesRouter = express.Router();

messagesRouter.get('/',  MessageController.findAll);

messagesRouter.post('/', async (req, res) => {
    const request = {
        groupId: 1,
        senderId: 1,
        content: 'test message',
        timestamp: new Date(),
    }
    MessageController.save(request, res);
})

export default messagesRouter;