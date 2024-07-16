import express from "express";
import UserController from "../controller/UserController.js";
import { requestFriendValidations, acceptFriendValidations, deleteFriendValidations, blockFriendValidations, findUserByIdValidations } from "../validators/userValidator.js";
import { addActiveUserIdInReq } from "../common/utils.js";

const friendsRouter = express.Router();

// find friends
friendsRouter.get('/:id?', addActiveUserIdInReq, findUserByIdValidations, UserController.findAllFriendsOfUser);

// detailed friendships of a user
friendsRouter.get('/detailed/:id?', addActiveUserIdInReq, findUserByIdValidations, UserController.findAllDetailedFriendsOfUser);

// request friendship
friendsRouter.post('/request', requestFriendValidations, UserController.requestFriendship);

// accept friendship
friendsRouter.put('/accept/:friendId?', acceptFriendValidations, UserController.acceptFriendship);

// delete friendship - can be used both for accepted and pending friendships
friendsRouter.delete('/delete/:friendId?', deleteFriendValidations, UserController.deleteFriend);

// block friend
friendsRouter.put('/block/:friendId?', blockFriendValidations, UserController.blockUser);

// find frineds birthdays
friendsRouter.get('/birthdays/get', addActiveUserIdInReq, UserController.findFriendsBirthdays);


export default friendsRouter;