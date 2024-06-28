import bcrypt from 'bcrypt';
import { uniq } from 'underscore';
import { postgresQuery } from '../db/postgres.js';
import { findUsersInIds } from '../db/queries/userQueries.js';
import { getThumbnailUrl } from '../common/utils.js';

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
    }
}

export const userToResDto = user => {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        createAt: user.created_at,
        profilePictureUrl: user.profile_pic,
        profilePictureThumb: getThumbnailUrl(user.id, user.profile_pic),
        name: user.displayed_name,
        description: user.description,
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

export const detailedFriendToResDto = async friendships => {
    const friendIds = friendships.map(friend => friend.friend_id);
    const userId = friendships.map(friend => friend.user_id).find(() => true);
    const userParams = uniq([
        ...friendIds,
        userId
    ]);
    const userResults = await postgresQuery(findUsersInIds(userParams.toString()));
    const users = userResults ? userResults.rows.map(user => userToResDto(user)) : [];
    return {
        friends: friendships.map(friendship => ({
            user: friendship.user_id,
            friend: users.find(user => user.id === friendship.friend_id),
            createdAt: friendship.created_at,
            status: friendship.status,
        })),
        user: users.find(user => user.id === userId)
    };
}