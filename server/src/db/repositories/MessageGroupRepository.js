import { groupToResDto, simpleGroupResDto } from "../../mapper/messageMapper.js";
import MessageGroup from "../../model/MessageGroup.js";
import { postgresQuery } from "../postgres.js";
import { findUsersInIds } from "../queries/userQueries.js";
import mongoose from "mongoose";

export const insertNewGroup = async (userIds) => {
    try {
        const userResults = await postgresQuery(findUsersInIds(userIds.toString()));
        if (userResults && userResults.rows.length > 0) {
            const insert = { 
                groupName: null,
                members: userIds.map(id => parseInt(id)),
            };
        
            // Create a new MessageGroup entry
            const newGroup = new MessageGroup(insert);
        
            // Save the entry to the database
            const savedGroup = await newGroup.save();
        
            return savedGroup;
        } else {
            throw new Error ('Users do not exist.');
        }
        
    } catch (e) {
        console.log("Insert to MessageGroup error: ", e);
        throw new Error(e);
    }
}

export const findMessageGroupById = async groupId => {
    try {
        const query = { _id: new mongoose.Types.ObjectId(groupId.toString()) };
        const foundGroup = await MessageGroup.find(query);
        return foundGroup && foundGroup.length > 0 ? foundGroup[0] : null;
    } catch (e) {
        console.log("Query to MessageGroup error: ", e);
        throw new Error(e);
    }
}

export const findAllUserMessageGroups = async (userId, simple = false) => {
    try {
        // const foundGroups = await MessageGroup.aggregate(pipeline);
        const foundGroups = await MessageGroup.find({ members: parseInt(userId) })
          .sort({ timestamp: -1 });
        return simple ? simpleGroupResDto(foundGroups) : await groupToResDto(foundGroups, userId);
    } catch (e) {
        console.log("Query to MessageGroup error: ", e);
        throw new Error(e);
    }
}