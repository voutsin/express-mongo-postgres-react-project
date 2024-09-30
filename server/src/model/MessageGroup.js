import mongoose from "mongoose";

const MessageGroupSchema = new mongoose.Schema({
  groupName: {
    type: String,
  },
  members: [{
    type: Number, // Array of user IDs from PostgreSQL
    required: true
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('MessageGroup', MessageGroupSchema);