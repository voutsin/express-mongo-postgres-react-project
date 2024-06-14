import { FeedTypes } from "../../common/enums.js";
import Feed from "../../model/Feed.js";

export const insertNewFeedForPost = async (post, userId) => {
    try {
        const insert = { 
            userId: parseInt(userId), 
            type: FeedTypes.POST, 
            content: { postId: parseInt(post.id) }
        };
    
        // Create a new feed entry
        const newFeed = new Feed(insert);
    
        // Save the entry to the database
        const savedFeed = await newFeed.save();
    
        return savedFeed;
    } catch (e) {
        console.log("Insert to Feed error: ", e);
        throw new Error(e);
    }
}

export const deleteFeedByPostId = async postId => {
    try {
        // with postId in content -> will be deleted posts, comments, reactions feeds
        const result = await Feed.deleteMany({ 'content.postId': postId });
        // Check how many feeds were deleted
        if (result.deletedCount === 0) {
            throw new Error('No feeds found to delete for the given postId');
        }
        return result;
    } catch (e) {
        console.log("Delete Feed error: ", e);
        throw new Error(e);
    }
}

export const findFeedsForUser = async (friendsIds, pageSize, skip) => {
    try {
        // Find the total number of documents for the user
        const totalRecords = await Feed.countDocuments({ userId: { $in: friendsIds } });

        // Find feeds with pagination
        const feeds = await Feed.find({ userId: { $in: friendsIds } })
          .sort({ timestamp: -1 }) // Optionally sort by timestamp or any other field
          .skip(skip)
          .limit(pageSize);
        
        return {
            totalRecords,
            feeds,
        }
    } catch (e) {
        console.log("Find Feeds error: ", e);
        throw new Error(e);
    }
}

export const insertOrUpdateCommentFeed = async comment => {
    const {
        id,
        user_id,
        post_id,
        created_at
    } = comment;

    try {
        // find if feed already exists for user and postId with type comment
        const query = { userId: Number(user_id), 'content.postId': Number(post_id), 'content.commentId': Number(id), type: Number(FeedTypes.COMMENT) };
        const alreadyFeed = await Feed.find(query);

        // new feed
        const feed = { 
            userId: parseInt(user_id), 
            type: FeedTypes.COMMENT, 
            content: { postId: parseInt(post_id), commentId: id },
            timestamp: created_at,
        };

        let result = null;

        if (alreadyFeed.length > 0) {
            // update feed
            const update = await Feed.updateOne(query, feed);
            if (update.modifiedCount === 0) {
                throw new Error('No feed updated')
            }
            result = feed;
        } else {
            // insert new feed
            const newFeed = new Feed(feed);
            // Save the entry to the database
            const savedFeed = await newFeed.save();
            result = savedFeed;
        }

        return result;
    } catch (e) {
        console.log("Insert/Update comment to Feed error: ", e);
        throw new Error(e);
    }
}

export const updateCommentFeed = async comment => {
    const {
        id,
        user_id,
        post_id,
    } = comment;

    try {
        const query = { userId: Number(user_id), 'content.postId': Number(post_id), 'content.commentId': Number(id), type: Number(FeedTypes.COMMENT) };
        const feed = {
            userId: parseInt(user_id), 
            type: FeedTypes.COMMENT, 
            content: { postId: parseInt(post_id), commentId: id },
            timestamp: new Date(),
        }
        // update feed
        const update = await Feed.updateOne(query, feed);
        if (update.modifiedCount === 0) {
            throw new Error('No feed updated')
        }
        return feed;
    } catch (e) {
        console.log("Update comment to Feed error: ", e);
        throw new Error(e);
    }
}

export const deleteCommentFeed = async (previousComment, oldCommentId) => {
    try {
        // delete reactions feeds for this comment
        await deleteCommentReactionFeed(oldCommentId);

        if (previousComment) {
            const {
                id,
                user_id,
                post_id
            } = previousComment;

            const query = { userId: Number(user_id), 'content.postId': Number(post_id), 'content.commentId': Number(id), type: Number(FeedTypes.COMMENT) };
            const feed = {
                userId: parseInt(user_id), 
                type: FeedTypes.COMMENT, 
                content: { postId: parseInt(post_id), commentId: id },
                timestamp: new Date(),
            }

            // update feed
            const update = await Feed.updateOne(query, feed);
            if (update.modifiedCount === 0) {
                throw new Error('No feed updated')
            }
            return feed;
        } else {
            const query = { 'content.commentId': Number(oldCommentId), type: Number(FeedTypes.COMMENT) };
            // delete feed
            const deleted = await Feed.deleteOne(query);
            if (deleted.deletedCount === 0) {
                throw new Error('No feeds found to delete for the given comment');
            }

            return deleted;
        }
    } catch (e) {
        console.log("Update comment to Feed error: ", e);
        throw new Error(e);
    }
}

export const insertNewFeedForReaction = async reaction => {
    try {
        const {
            id, user_id, post_id, comment_id
        } = reaction;

        const insert = { 
            userId: parseInt(user_id), 
            type: FeedTypes.REACTION, 
            content: { 
                postId: parseInt(post_id),
                commentId: comment_id,
                reactionId: parseInt(id),
            }
        };
        // Create a new feed entry
        const newFeed = new Feed(insert);
        // Save the entry to the database
        const savedFeed = await newFeed.save();
        return savedFeed;
    } catch (e) {
        console.log("Insert to Feed error: ", e);
        throw new Error(e);
    }
}

export const updateReactionFeed = async reaction => {
    const {
        id, user_id, post_id, comment_id
    } = reaction;

    try {
        const query = { userId: Number(user_id), 'content.postId': Number(post_id), 'content.reactionId': Number(id), type: Number(FeedTypes.REACTION) };
        const feed = {
            userId: parseInt(user_id), 
            type: FeedTypes.REACTION, 
            content: { postId: parseInt(post_id), commentId: comment_id, reactionId: id },
            timestamp: new Date(),
        }
        // update feed
        const update = await Feed.updateOne(query, feed);
        if (update.modifiedCount === 0) {
            throw new Error('No feed updated')
        }
        return feed;
    } catch (e) {
        console.log("Update comment to Feed error: ", e);
        throw new Error(e);
    }
}

export const deleteReactionFeed = async reaction => {
    const {
        id, user_id, post_id
    } = reaction;

    try {
        const query = { userId: Number(user_id), 'content.postId': Number(post_id), 'content.reactionId': Number(id), type: Number(FeedTypes.REACTION) };
        // delete feed
        const deleted = await Feed.deleteOne(query);
        if (deleted.deletedCount === 0) {
            throw new Error('No feeds found to delete for the given reaction');
        }
        return deleted;
    } catch (e) {
        console.log("Update comment to Feed error: ", e);
        throw new Error(e);
    }
}

export const deleteCommentReactionFeed = async commentId => {
    try {
        // all reactions with comment id
        const query = { 'content.commentId': Number(commentId), type: Number(FeedTypes.REACTION) };
        // delete feed
        const deleted = await Feed.deleteMany(query);
        if (deleted.deletedCount === 0) {
            throw new Error('No feeds found to delete for the given reaction');
        }
        return deleted;
    } catch (e) {
        console.log("Update comment to Feed error: ", e);
        throw new Error(e);
    }
}