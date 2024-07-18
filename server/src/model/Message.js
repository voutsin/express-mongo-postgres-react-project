import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'MessageGroup'
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
  },
  readBy: [{
    type: Number, // Array of user IDs who have read the message
    default: []
  }]
});

// Pre-save hook to add senderId to readBy array
MessageSchema.pre('save', function(next) {
  if (!this.readBy.includes(this.senderId)) {
    this.readBy.push(this.senderId);
  }
  next();
});

export default mongoose.model('Message', MessageSchema);