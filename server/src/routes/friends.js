import express from "express";
import UserController from "../controller/UserController.js";
import { requestFriendValidations, acceptFriendValidations, deleteFriendValidations, blockFriendValidations } from "../validators/userValidator.js";

const friendsRouter = express.Router();

// find friends
friendsRouter.get('/:id', UserController.findAllFriendsOfUser);

// request friendship
friendsRouter.post('/request/:friendId', requestFriendValidations, UserController.requestFriendship);

// accept friendship
friendsRouter.put('/accept/:friendId', acceptFriendValidations, UserController.acceptFriendship);

// delete friendship - can be used both for accepted and pending friendships
friendsRouter.delete('/delete/:friendId', deleteFriendValidations, UserController.deleteFriend);

// block friend
friendsRouter.put('/block/:friendId', blockFriendValidations, UserController.blockUser);


export default friendsRouter;