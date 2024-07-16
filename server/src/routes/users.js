import express from "express";
import UserController from "../controller/UserController.js";
import { findUserByIdValidations, searchUserValidations, updateUserValidations } from "../validators/userValidator.js";
import { createMediaThumbnail, createThumbnail, uploadMiddleware } from "../middleware/uploadMiddleware.js";
import { addActiveUserIdInReq } from "../common/utils.js";

const usersRouter = express.Router();

// find all users
usersRouter.get('/', UserController.findAll);

// search active users by criteria - filter for active users
usersRouter.get('/search/:text?', searchUserValidations, UserController.searchUserByCriteria);

// find user
usersRouter.get('/:id?', addActiveUserIdInReq, findUserByIdValidations, UserController.findByUserId);

// update user
usersRouter.put('/edit', updateUserValidations, UserController.updateUser);

// add profile pic
usersRouter.put('/edit/profilePic', addActiveUserIdInReq, uploadMiddleware.single('profile_pic'), createThumbnail, createMediaThumbnail, UserController.editProfilePic);

// deactivate profile
usersRouter.put('/deactivate', UserController.deactivateProfile);

// user photos (posts, profile)
usersRouter.get('/media/:id?', addActiveUserIdInReq, findUserByIdValidations, UserController.findUserPhotos);

export default usersRouter;