import { uniq } from "underscore";
import { postgresQuery } from "../db/postgres.js";
import { findUsersInIds } from "../db/queries/userQueries.js";
import { userToResDto } from "./userMapper.js";
import { findMessageGroupById } from "../db/repositories/MessageGroupRepository.js";

export const groupToResDto = async groups => {
    const userIds = [];
    groups.forEach(group => {
        userIds.push(...group.members);
    });
    let users = [];
    if (userIds.length > 0) {
        const userResults = await postgresQuery(findUsersInIds(uniq(userIds).toString()));
        users = userResults ? userResults.rows.map(user => userToResDto(user)) : [];
    }
    
    return groups.map(group => {
        return {
            timestamp: group.timestamp,
            groupName: group.groupName,
            id: group._id,
            members: userIds.length > 0 ? group.members.map(member => users.find(user => user.id === member)) : group.members,
        }
    })
}

export const simpleGroupResDto = groups => {
    return groups.map(group => ({
        timestamp: group.timestamp,
        groupName: group.groupName,
        id: group._id,
        members: group.members,
    }))
}

export const messageToResDto = message => ({
    id: message._id,
    groupId: message.groupId,
    senderId: message.senderId,
    content: message.content,
    timestamp: message.timestamp,
});

export const messageAndGroupResDto = async (message, newGroupId) => {
    const group = await findMessageGroupById(newGroupId);
    const groupResDtos = await groupToResDto([group]);
    return {
        message: messageToResDto(message),
        group: groupResDtos[0]
    }
}