import mongoose from "mongoose";
import { asyncHandler } from "../common/utils.js";
import { findAllUserMessageGroups } from "../db/repositories/MessageGroupRepository.js";
import AppError from "../model/AppError.js";
import Message from "../model/Message.js";
import MessageGroup from "../model/MessageGroup.js";

const findAllUserGroups = asyncHandler(async (req, res, next) => {
    try{
        // TODO: pageable
        const groups = await findAllUserMessageGroups(req.userId);
        return res.status(200).send(groups);
    } catch (e) {
        next(new AppError('Internal Server Error: ' + e, 500));
    }
});

const deleteGroupById = asyncHandler(async (req, res, next) => {
    try{
        const messageQuery = { groupId: new mongoose.Types.ObjectId(req.params.id.toString()) };
        await Message.deleteMany(messageQuery)

        const groupQuery = { _id: new mongoose.Types.ObjectId(req.params.id.toString()) };
        const result = await MessageGroup.deleteMany(groupQuery);
        // Check how many feeds were deleted
        if (result.deletedCount === 0) {
            throw new Error('No groups found to delete for the given id');
        }
        const groups = await findAllUserMessageGroups(req.userId);
        return res.status(200).send(groups);
    } catch (e) {
        next(new AppError('Internal Server Error: ' + e, 500));
    }
});

export default {
    findAllUserGroups,
    deleteGroupById
};