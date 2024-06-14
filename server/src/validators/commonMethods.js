import { FriendStatus } from '../common/enums.js';
import { getActiveUser } from '../common/utils.js';
import { postgresQuery } from '../db/postgres.js';
import { findCommentByIdSQL } from '../db/queries/commentsQueries.js';
import { findFriendshipByIds } from '../db/queries/friendsQueries.js';
import { findPostByIdSQL, userCanAccessPostSQL } from '../db/queries/postsQueries.js';
import { findReactionByIdSQL } from '../db/queries/reactionsQueries.js';
import { findByEmail, findByUserName, findUserById } from '../db/queries/userQueries.js';

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

export const canAccessPost = async (activeUserId, postId, postUserId) => {
    const postResult = await postgresQuery(userCanAccessPostSQL, [activeUserId, postId]);
    const isFriendPost = postResult && postResult.rows.length > 0;
    const isActiveUserPost = parseInt(activeUserId) === parseInt(postUserId);
    return isFriendPost || isActiveUserPost;
}

export const postExists = async postId => {
    const postResult = await postgresQuery(findPostByIdSQL, [postId]);
    return postResult && postResult.rows.length > 0 ? postResult.rows[0] : false;
}

export const commentExists = async commentId => {
    const commentResult = await postgresQuery(findCommentByIdSQL, [commentId]);
    return commentResult && commentResult.rows.length > 0 ? commentResult.rows[0] : false;
}

export const reactionExists = async reactionId => {
    const reactionResult = await postgresQuery(findReactionByIdSQL, [reactionId]);
    return reactionResult && reactionResult.rows.length > 0 ? reactionResult.rows[0] : false;
}