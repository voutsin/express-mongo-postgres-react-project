import mongoose from "mongoose";
import Message from "../../model/Message.js";
import { findMessageGroupById, insertNewGroup } from "./MessageGroupRepository.js";

export const insertNewMessageAndGroup = async (data, activeUserId) => {
    try {
        const insertedGroup = await insertNewGroup([data.receiverId, activeUserId]);
        const insert = { 
            groupId: insertedGroup._id,
            senderId: activeUserId,
            content: data.content,
        };
    
        // Create a new message entry
        const newMessage = new Message(insert);
    
        // Save the entry to the database
        const savedMessage = await newMessage.save();
    
        return savedMessage;
    } catch (e) {
        console.log("Insert to Message error: ", e);
        throw new Error(e);
    }
}

export const insertNewMessage = async (data, activeUserId) => {
    try {
        const alreadyGroup = await findMessageGroupById(data.groupId);

        if (alreadyGroup) {
            const insert = { 
                groupId: data.groupId,
                senderId: activeUserId,
                content: data.content,
            };
        
            // Create a new message entry
            const newMessage = new Message(insert);
        
            // Save the entry to the database
            const savedMessage = await newMessage.save();
        
            return savedMessage;
        } else {
            throw new Error('Group not found.')
        }
    } catch (e) {
        console.log("Insert to Message error: ", e);
        throw new Error(e);
    }
}

export const findAllGroupMessages = async (groupId, pageSize, skip) => {
    try {
        // Find messages with pagination
        const countPipeline = [
            {
                $match: {
                    groupId: new mongoose.Types.ObjectId(groupId)
                }
            },
        ]
        const pipeline = [
            {
                $match: {
                    groupId: new mongoose.Types.ObjectId(groupId)
                }
            },
            {
              $sort: {
                timestamp: 1
              }
            },
            {
              $skip: skip
            },
            {
              $limit: pageSize
            },
        ]
        const messages = await Message.aggregate(pipeline);
        const countResult = await Message.aggregate(countPipeline);

        return {
            totalRecords: (countResult.length > 0) ? countResult[0].totalGroups : 0,
            messages,
        }
    } catch (e) {
        console.log("Find messages error: ", e);
        throw new Error(e);
    }
}

export const findUnreadMessagesInGroup = async (groupId, userId) => {
    try {
        const query = { 
            readBy: { 
                $nin: [Number(parseInt(userId))] 
            }, 
            groupId: new mongoose.Types.ObjectId(groupId),
        }
        const results = await Message.find(query);
        return {
            messages: results || [],
            total: results ? results.length : 0
        };
    } catch (e) {
        console.log("Find messages error: ", e);
        throw new Error(e);
    } 
}

export const addUserToGroupMessagesReadBy = async (groupId, userId) => {
    try {
        const query = { 
            readBy: { 
                $nin: [Number(parseInt(userId))] 
            },
            groupId: new mongoose.Types.ObjectId(groupId),
        }
        const results = await Message.updateMany(query, { $addToSet: { readBy: userId } });
        
        return {
            ...results,
            groupId
        };
    } catch (e) {
        console.log("Find messages error: ", e);
        throw new Error(e);
    } 
}