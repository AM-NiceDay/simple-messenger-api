import co from 'co';
import mongoose from 'mongoose';
import { populateChatWithPeerId, populateChatsWithPeerId } from './utils';

const ChatSchema = mongoose.Schema({
  userIds: {
    type: [String],
    required: true,
    validate: value => value.length === 2,
  },
  lastMessageId: String,
  lastRead: { type: Object, default: {} },
});

ChatSchema.statics.getUserChat = function(userId, chatId) {
  return this.findById(chatId)
    .then(populateChatWithPeerId(userId));
}

ChatSchema.statics.getUserChats = co.wrap(function* (userId) {
  return this.find({ userIds: userId }).exec()
    .then(chats => chats.map(chat => chat.toObject()))
    .then(populateChatsWithPeerId(userId));
});

ChatSchema.statics.updateChatLastRead = co.wrap(function* ({ userId, chatId, lastRead }) {
  return yield this.findOneAndUpdate(
    { _id: chatId },
    { $set: { [`lastRead.${userId}`]: lastRead } },
    { new: true }
  )
    .then(chat => chat.toObject())
    .then(populateChatWithPeerId(userId));
});

export default ChatSchema;
