import mongoose from 'mongoose';

const ChatSchema = mongoose.Schema({
  userIds: [String],
  lastMessageId: String,
});

export default mongoose.model('Chat', ChatSchema);
