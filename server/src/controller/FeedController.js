import { postgresQuery } from '../db/postgres.js';
import { asyncHandler, getActiveUser } from '../common/utils.js';
import { findAllActiveFriendshipsByUserId } from '../db/queries/friendsQueries.js';
import { findFeedsGroupByPost } from '../db/repositories/FeedRepository.js';
import { feedByPostResDto } from '../mapper/feedMapper.js';
import { uniq } from 'underscore';
import AppError from '../model/AppError.js';

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
const findUserPostFeed = asyncHandler(async (req, res, next) => {
    try {
        const activeUser = getActiveUser(req);
        if (activeUser == null) {
            next(new AppError('No active user found', 400));
        }

        const userId = parseInt(activeUser.id);
        const page = parseInt(req.query.page) || 1; // default to page 1 if not provided
        const pageSize = parseInt(req.query.pageSize) || 10; // default to 10 items per page if not provided
        const skip = (page - 1) * pageSize;

        // find all active user's friends
        const friendsResults = await postgresQuery(findAllActiveFriendshipsByUserId, [userId]);
        if (!friendsResults || (friendsResults && friendsResults.rows.length === 0)) {
            return res.status(200).send('No friends made yet. Consider adding some friends to see news!');
        }
        const friendsIds = friendsResults.rows.map(row => row.friend_id);
        const userIds = uniq([
            ...friendsIds,
            parseInt(activeUser.id)
        ]);

        // find feeds based on his friends actions
        const feedsResults = await findFeedsGroupByPost(userIds, pageSize, skip);
        // const feeds = await feedToResDto(feedsResults.feeds);
        const feeds = await feedByPostResDto(feedsResults.feeds);

        // Return results and pagination metadata
        res.status(200).send({
          page,
          pageSize,
          totalPages: Math.ceil(feedsResults.totalRecords / pageSize),
          totalRecords: feedsResults.totalRecords,
          feeds: feeds
        });
    } catch (e) {
        next(new AppError('Internal Server Error: ' + e, 500));
    }
})

export default {
    findUserPostFeed,
}