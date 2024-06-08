import mongoose from "mongoose";

// Define the schema for the nested content field
const ContentSchema = new mongoose.Schema({
    postId: {
      type: Number,
      required: true
    },
    commentId: {
        type: Number,
    },
    reationId: {
        type: Number,
    }
});

const FeedSchema = new mongoose.Schema({
  userId: {
    type: Number, // Reference to users table - user that created the action (post/comment/reaction)
    required: true
  },
  type: {
    type: Number,
    required: true
  },
  content: {
    type: ContentSchema,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Feed = mongoose.model('Feed', FeedSchema);

export default Feed;