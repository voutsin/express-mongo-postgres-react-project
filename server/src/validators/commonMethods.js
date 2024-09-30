import { FriendStatus } from '../common/enums.js';
import { getActiveUser } from '../common/utils.js';
import { postgresQuery } from '../db/postgres.js';
import { findCommentByIdAndActiveUserSQL } from '../db/queries/commentsQueries.js';
import { findAllFriendshipsByUserIdAndStatus, findFriendshipByIds } from '../db/queries/friendsQueries.js';
import { findPostByIdAndActiveUserSQL, userCanAccessPostSQL } from '../db/queries/postsQueries.js';
import { findReactionByIdAndActiveUserSQL } from '../db/queries/reactionsQueries.js';
import { findByEmail, findByUserName, findUserById } from '../db/queries/userQueries.js';
import bcrypt from 'bcrypt';
import { findMessageGroupById } from '../db/repositories/MessageGroupRepository.js';

export const emailExists = async email => {
    const res = await postgresQuery(findByEmail, [email]);
    return res.rows.length > 0;
}

export const usernameExists = async (attr, searchType) => {
    const res = await postgresQuery(
        searchType && searchType === 'id' ? findUserById : findByUserName, 
        [attr]
    );
    return res.rows.length > 0;
}

export const passwordMatch = async (password, username) => {
    const params = [username];
    const queryResult = await postgresQuery(findByUserName, params);
    // get first as username is unique
    const user = queryResult.rows[0];
    // Compare the input password with the stored hash
    let match = false;
    if (user) {
        match = await bcrypt.compare(password, user.password_hash);
    }
    
    return user && match;
}

export const userIsTheCurrent = (req, attrToCheck, userValue) => {
    const activeUser = getActiveUser(req);
    if (activeUser == null) {
      return false;
    }
    return activeUser[userValue] === attrToCheck;
}

export const userIsFriend = async (req, userId) => {
    const activeUser = getActiveUser(req);
    if (activeUser == null) {
      return false;
    }
    const id = userId || req.params.id;
    const friendship = await postgresQuery(findFriendshipByIds, [activeUser.id, id]);
    const activeFriendships = friendship && friendship.rows && friendship && friendship.rows.filter(row => row.status === FriendStatus.ACCEPTED);
    return activeFriendships && activeFriendships.length > 0;
}

export const userIsBlocked = async (userId, activeUserId) => {
    if (userId !== activeUserId) {
        const blockedResults = await postgresQuery(findAllFriendshipsByUserIdAndStatus, [userId, activeUserId, FriendStatus.BLOCKED]);
        return blockedResults && blockedResults.rows.length > 0
    }
    return false;
}

export const canAccessPost = async (activeUserId, postId, postUserId) => {
    const postResult = await postgresQuery(userCanAccessPostSQL, [activeUserId, postId]);
    const isFriendPost = postResult && postResult.rows.length > 0;
    const isActiveUserPost = parseInt(activeUserId) === parseInt(postUserId);
    return isFriendPost || isActiveUserPost;
}

export const postExists = async postId => {
    const postResult = await postgresQuery(findPostByIdAndActiveUserSQL, [postId]);
    return postResult && postResult.rows.length > 0 ? postResult.rows[0] : false;
}

export const commentExists = async commentId => {
    const commentResult = await postgresQuery(findCommentByIdAndActiveUserSQL, [commentId]);
    return commentResult && commentResult.rows.length > 0 ? commentResult.rows[0] : false;
}

export const reactionExists = async reactionId => {
    const reactionResult = await postgresQuery(findReactionByIdAndActiveUserSQL, [reactionId]);
    return reactionResult && reactionResult.rows.length > 0 ? reactionResult.rows[0] : false;
}

export const groupExists = async groupId => {
    const groupResult = await findMessageGroupById(groupId);
    return (groupResult);
}