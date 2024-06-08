import express from "express";
import FeedController from "../controller/FeedController.js";

const feedsRouter = express.Router();

// get feed of a user -- all posts and reactions of friends sorted by created timestamp
feedsRouter.get('/user', FeedController.findUserPostFeed);

export default feedsRouter;