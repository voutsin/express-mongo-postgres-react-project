import { uniq } from "underscore";
import { postgresQuery } from "../db/postgres.js";
import { findUsersInIds } from "../db/queries/userQueries.js";
import { userToResDto } from "./userMapper.js";
import { findMessageGroupById } from "../db/repositories/MessageGroupRepository.js";
import { findUnreadMessagesInGroup } from "../db/repositories/MessageRepository.js";

export const groupToResDto = async (groups, activeUserId) => {
    const userIds = [];
    groups.forEach(group => {
        userIds.push(...group.members);
    });
    let users = [];
    if (userIds.length > 0) {
        const userResults = await postgresQuery(findUsersInIds(uniq(userIds).toString()));
        users = userResults ? userResults.rows.map(user => userToResDto(user)) : [];
    }
    
    return await Promise.all(groups.map(async group => {
        const unreadMesasges = await findUnreadMessagesInGroup(group.id, activeUserId);
        return {
            timestamp: group.timestamp,
            groupName: group.groupName,
            id: group._id,
            members: userIds.length > 0 ? group.members.map(member => users.find(user => user.id === member)) : group.members,
            hasNewMessage: unreadMesasges.total,
        }
    }));
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
    readBy: message.readBy,
});

export const messageAndGroupResDto = async (message, newGroupId, activeUserId) => {
    const group = await findMessageGroupById(newGroupId);
    const groupResDtos = await groupToResDto([group], activeUserId);
    return {
        message: messageToResDto(message),
        group: groupResDtos[0]
    }
}