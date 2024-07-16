import bcrypt from 'bcrypt';
import { uniq } from 'underscore';
import { postgresQuery } from '../db/postgres.js';
import { findUsersInIds } from '../db/queries/userQueries.js';
import { getThumbnailUrl, timestampToDate } from '../common/utils.js';
import { FriendStatus } from '../common/enums.js';

export const newUserReqDtoToUser = async req => {
    const saltRounds = 10;
    return {
        username: req.username,
        email: req.email,
        password_hash: await bcrypt.hash(req.password, saltRounds),
        created_at: new Date(),
        profile_pic: req.profilePictureUrl,
        displayed_name: req.name,
        description: req.description,
        birth_date: req.birthDate,
    }
}

export const updateUserReqDtoToUser = async req => {
    const saltRounds = 10;
    return {
        username: req.username,
        email: req.email,
        password_hash: await bcrypt.hash(req.password, saltRounds),
        profile_pic: req.profilePictureUrl,
        displayed_name: req.name,
        description: req.description,
        birth_date: req.birthDate,
    }
}

export const userToResDto = user => {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        createAt: user.created_at,
        profilePictureUrl: user.profile_pic,
        profilePictureThumb: getThumbnailUrl(user.id, user.profile_pic, true),
        name: user.displayed_name,
        description: user.description,
        birthDate: user.birth_date,
        active: Boolean(user.active),
    }
}

export const friendToResDto = friendship => {
    return {
        userId: friendship.user_id,
        friendId: friendship.friend_id,
        createdAt: friendship.created_at,
        status: friendship.status,
    }
}

export const detailedFriendToResDto = async (friendships, detailed) => {
    const friendIds = friendships.map(friend => friend.friend_id);
    const userId = friendships.map(friend => friend.user_id).find(() => true);
    const userParams = uniq([
        ...friendIds,
        userId
    ].filter(p => p != null && p !== '')
    );
    let users = [];
    
    if (userParams.length > 0) {
        const userResults = await postgresQuery(findUsersInIds(userParams.toString()));
        users = userResults ? userResults.rows.map(user => userToResDto(user)) : [];
    }
    return {
        friends: friendships.map(friendship => {
            const user = users.find(user => user.id === friendship.friend_id);
            return {
                user: friendship.user_id,
                friend: detailed ? {
                    ...user,
                    isFriends: friendship.is_friends === FriendStatus.ACCEPTED,
                    isFriendsStatus: friendship.is_friends,
                } : user,
                createdAt: friendship.created_at,
                status: friendship.status,
            }
        }),
        user: users.find(user => user.id === userId)
    };
}

export const detailedFriendToResDtoWithCounters = result => {
    const friends = result.friends;
    
    return {
        ...result,
        friends: result.friends.map(f => ({
            ...f,
            status: parseInt(f.status),
        })),
        counters: {
            3: friends.filter(f => f.status === FriendStatus.ACCEPTED).length, // ACCEPTED
            1: friends.filter(f => f.status === FriendStatus.REQUESTED).length, // REQUESTED
            2: friends.filter(f => f.status === FriendStatus.PENDING).length, // PENDING
            4: friends.filter(f => f.status === FriendStatus.BLOCKED).length, // BLOCKED
        }
    };
}

export const friendAndUserResDto = result => ({
    userId: result.user_id,
    friendId: result.friend_id,
    frienshipStatus: result.status,
    friendsSince: timestampToDate(result.fr_created_at),
    friendUsername: result.username,
    friendEmail: result.email,
    friendCreated: timestampToDate(result.created_at),
    friendPicThumbnail: getThumbnailUrl(result.id, result.profile_pic, true),
    friendName: result.displayed_name,
    friendDescription: result.description,
    friendActive: Boolean(result.active),
    friendBirthDate: timestampToDate(result.birth_date),
});

export const userDetailedResDto = user => {
    return {
        ...userToResDto(user),
        createdAt: timestampToDate(user.created_at),
        birthDate: timestampToDate(user.birth_date),
    }
}