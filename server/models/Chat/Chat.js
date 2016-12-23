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
  lastReadMessageIds: {},
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

export default ChatSchema;
