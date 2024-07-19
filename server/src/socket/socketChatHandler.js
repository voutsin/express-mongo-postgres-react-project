import { MessageStatus } from "../common/enums.js";
import { postgresQuery } from "../db/postgres.js";
import { findAllActiveFriendshipsByUserId } from "../db/queries/friendsQueries.js";
import { addUserToGroupMessagesReadBy, findAllGroupMessages, insertNewMessage, insertNewMessageAndGroup } from "../db/repositories/MessageRepository.js";
import { messageAndGroupResDto, messageToResDto } from "../mapper/messageMapper.js";

export default io => {
    
    const sendMessage = async function (payload, callback) {
        const socket = this;
        const { groupId, receiverId } = payload;
        const { authUser } = socket;

        try {
            let message = null;
            let newGroupId = null;
            let newGroupMembers = [];

            if (groupId && authUser) {
                // existing group
                message = await insertNewMessage(payload, authUser.userId);
            } else if (receiverId && authUser) {
                message = await insertNewMessageAndGroup(payload, authUser.userId);
                newGroupId = message.groupId;
                newGroupMembers = [receiverId, authUser.userId];
            }

            // Broadcast the message to all connected clients
            if (message && (groupId || newGroupId)) {    
                // Join the new group room for involved users
                if (newGroupId) {
                    newGroupMembers.forEach(memberId => {
                        // Find the socket for the member and join the new group room
                        const sockets = io.sockets.sockets;
                        sockets.forEach(socket => {
                            if (authUser && authUser.userId === memberId) {
                                socket.join(newGroupId.toString());
                            }
                        });
                    });
                    const response = await messageAndGroupResDto(message, newGroupId, authUser.userId);
                    io.to(newGroupId.toString()).emit('receive_message_and_group', response);
                } else {
                    io.to(groupId.toString()).emit('receive_message', messageToResDto(message));
                }
            }

            callback({
                status: MessageStatus.SENT
            });
        } catch (error) {
            console.log('SOCKET ERROR: ', e);
            // Send error back to the user
            io.emit('error_message', 'Failed to save message');
            callback({
                status: MessageStatus.FAILED
            });
        }
    }

    const getGroupMessages = async function (payload, callback) {
        const { groupId, pageSize, page } = payload;
        const pageNo = parseInt(page) || 1; // default to page 1 if not provided
        const limit = parseInt(pageSize) || 100; // default to 10 items per page if not provided
        const skip = (pageNo - 1) * limit;

        if (groupId) {
            try {
                const messages = await findAllGroupMessages(groupId, limit, skip);
                const response = {
                    messages: messages.messages.map(m => messageToResDto(m)),
                    total: messages.totalRecords,
                    status: MessageStatus.SENT
                };

                callback(response);
                // Broadcast the message to all connected clients
                const socket = this;
                socket.emit('receive_messages', response);
            } catch (e) {
                // Send error back to the user
                io.emit('error_message', 'Failed to save message');
                callback({
                    status: MessageStatus.FAILED,
                    message: e
                });
            }
        } else {
            throw new Error('No group id found.');
        }
    }

    const markGroupMessagesReadByUser = async function (payload, callback) {
        const { groupId } = payload;
        const socket = this;
        const { authUser } = socket;

        try {
            const results = await addUserToGroupMessagesReadBy(groupId, authUser.userId);
            const response = {
                ...results,
                status: MessageStatus.SENT
            };
            callback(response);
            // Broadcast the message to all connected clients
            io.to(groupId.toString()).emit('messages_read', response);
        } catch (e) {
            console.log('SOCKET ERROR: ', e);
            io.emit('error_message', 'Failed to mark messages as read');
            callback({
                status: MessageStatus.FAILED
            });
        }

    }

    const getActiveFriends = async function (socket, callback, activeUsers) {
        const { authUser } = socket;
        const activeFriends = [];

        try {
            const userFriendsRes = await postgresQuery(findAllActiveFriendshipsByUserId, [authUser.userId]);

            if (userFriendsRes) {
                const friendsIds = userFriendsRes.rows.map(f => f.friend_id);
                activeUsers.forEach((value, key, map) => {
                    const userId = value.userId;
                    if (friendsIds.includes(userId)) {
                        activeFriends.push(userId);
                    }
                });

            }

            const response = {
                activeFriends,
                status: MessageStatus.SENT
            };
            callback(response);
            // Broadcast the message to all connected clients
            socket.emit('online_friends_list', response);
        } catch (e) {
            console.log('SOCKET ERROR: ', e);
            io.emit('error_message', 'Failed to mark messages as read');
            callback({
                status: MessageStatus.FAILED
            });
        }
    }
    
    const disconnect = function (socketId, activeUsers) {
        try {
            // socket.disconnect(true);
            // Remove the user from the active users map
            activeUsers.delete(socketId);
        } catch (e) {
            console.log('SOCKET ERROR: ', e);
        }
    }

    return {
        sendMessage,
        getGroupMessages,
        markGroupMessagesReadByUser,
        getActiveFriends,
        disconnect,
    }
};