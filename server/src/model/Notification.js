import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    // the user that did the action
    userId: { 
      type: Number,
      required: true
    },
    type: {
      type: Number, // NotificationTypes enum
      required: true
    },
    // post in which a comment or reaction is placed
    // null if type = 1 or 2
    postId: {
      type: Number,
    },
    // comment on which a reply or reaction is placed
    // null if type = 1, 2, 3, 5
    commentId: {
      type: Number,
    },
    // id of the comment or reaction that a userId did 
    // or user id in which the request is about
    targetId: {
        type: Number,
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    readBy: [{
      type: Number,
      default: []
    }]
});

export default mongoose.model('Notification', NotificationSchema);