import express from "express";
import UserController from "../controller/UserController.js";

const usersRouter = express.Router();

usersRouter.get('/', UserController.findAll);

export default usersRouter;