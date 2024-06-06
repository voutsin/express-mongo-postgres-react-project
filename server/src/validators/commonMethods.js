import { FriendStatus } from '../common/enums.js';
import { getActiveUser } from '../common/utils.js';
import { postgresQuery } from '../db/postgres.js';
import { findFriendshipByIds } from '../db/queries/friendsQueries.js';
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

export const userIsFriend = async req => {
    const activeUser = getActiveUser(req);
    if (activeUser == null) {
      return false;
    }
    const friendship = await postgresQuery(findFriendshipByIds, [activeUser.id, req.params.id]);
    const activeFriendships = friendship && friendship.rows && friendship && friendship.rows.filter(row => row.status === FriendStatus.ACCEPTED);
    return activeFriendships && activeFriendships.length > 0;
}