import { validationResult } from 'express-validator';
import { postgresQuery } from '../db/postgres.js';
import { getActiveUser } from '../common/utils.js';
import { findAllActiveFriendshipsByUserId } from '../db/queries/friendsQueries.js';
import { findFeedsForUser } from '../db/repositories/FeedRepository.js';
import { feedToResDto } from '../mapper/feedMapper.js';

/**
 * This is the endpoint that the user uses to display his feed.
 * Feed can contain posts, comments to posts and reactions to posts from his friends.
 * 
 * It starts with selection from Feed table and separates each type.
 * Fetching is pageable - contains picked results from db. 
 * 
 * Then it fetches the information about each type:
 * post -> post info with comments and reactions
 * comment -> comment info with all above post info
 * reaction -> reaction info with all the above post info
 * 
 * returns an array of objects.
 */
const findUserPostFeed = async (req, res) => {
    try {
        // check validations
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const activeUser = getActiveUser(req);
        if (activeUser == null) {
            throw new Error('No active user found');
        }   

        const userId = parseInt(activeUser.id);
        const page = parseInt(req.params.page) || 1; // default to page 1 if not provided
        const pageSize = parseInt(req.params.pageSize) || 10; // default to 10 items per page if not provided
        const skip = (page - 1) * pageSize;

        // find all active user's friends
        const friendsResults = await postgresQuery(findAllActiveFriendshipsByUserId, [userId]);
        if (!friendsResults || (friendsResults && friendsResults.rows.length === 0)) {
            return res.status(200).send('No friends made yet. Consider adding some friends to see news!');
        }
        const friendsIds = friendsResults.rows.map(row => row.friend_id);

        // find feeds based on his friends actions
        const feedsResults = await findFeedsForUser(friendsIds, pageSize, skip);
        const feeds = await feedToResDto(feedsResults.feeds);

        // Return results and pagination metadata
        res.status(200).send({
          page,
          pageSize,
          totalPages: Math.ceil(feedsResults.totalRecords / pageSize),
          totalRecords: feedsResults.totalRecords,
          feeds: feeds
        });
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal Server Error: ', e);
    }
}

export default {
    findUserPostFeed,
}