import express from "express";
import UserController from "../controller/UserController.js";
import { updateUserValidations } from "../validators/userValidator.js";

const usersRouter = express.Router();

// find all users
usersRouter.get('/', UserController.findAll);

// find user
usersRouter.get('/:id', UserController.findByUserId);

// update user
usersRouter.put('/edit', updateUserValidations, UserController.updateUser);

// add profile pic

// search active users by criteria - filter for active users

// deactivate profile


export default usersRouter;