import mongoose from 'mongoose';

export default mongoose.Schema({
  chatId: String,
  userId: String,
  text: String,
  created: { type: Date, default: Date.now },
});
