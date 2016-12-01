import mongoose from 'mongoose';

const ChatSchema = mongoose.Schema({
  userIds: [String],
  lastMessageId: String,
  lastMessageCreated: Date,
});

export default mongoose.model('Chat', ChatSchema);
