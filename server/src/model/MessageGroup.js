import mongoose from "mongoose";

const MessageGroupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true
  },
  members: [{
    type: Number, // Array of user IDs from PostgreSQL
    required: true
  }]
});

export default mongoose.model('MessageGroup', MessageGroupSchema);