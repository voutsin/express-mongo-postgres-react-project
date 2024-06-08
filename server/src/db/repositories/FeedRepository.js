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
        const result = await Feed.deleteMany({ 'content.postId': postId });
        // Check how many feeds were deleted
        if (result.deletedCount === 0) {
            throw new Error('No feeds found to delete for the given postId');
        }
        return result;
    } catch (e) {
        console.log("Insert to Feed error: ", e);
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
        
        console.log('feeds: ', feeds)
        console.log('totalRecords: ', totalRecords)

        return {
            totalRecords,
            feeds,
        }
    } catch (e) {
        console.log("Insert to Feed error: ", e);
        throw new Error(e);
    }
}