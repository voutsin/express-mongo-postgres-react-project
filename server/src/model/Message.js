import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  groupId: {
    type: String,
    required: true,
    // ref: 'MessageGroup'
  },
  senderId: {
    type: Number, // Reference to users table in PostgreSQL
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Message', MessageSchema);