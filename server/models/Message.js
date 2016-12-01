import mongoose from 'mongoose';

const MessageSchema = mongoose.Schema({
  chatId: String,
  userId: String,
  text: String,
  created: { type: Date, default: Date.now },
});

export default mongoose.model('Message', MessageSchema);
