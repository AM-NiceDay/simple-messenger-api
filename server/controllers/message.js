import co from 'co';
import redis from 'redis';
import Message from '../models/Message';
import Chat from '../models/Chat';

const redisPub = redis.createClient();

export const getChatMessages = (req, res) => {
  const userId = req.user._id;
  const { chatId } = req.params;

  Message.find({ chatId: chatId }).exec()
    .then(messages => res.status(200).json(messages));
};

export const createChatMessage = co.wrap(function* (req, res) {
  const redisClient = req.app.get('redis-client');

  const userId = req.user._id;
  const { chatId } = req.params;
  const { text } = req.body;

  const message = yield new Message({
    chatId,
    userId,
    text,
  }).save();

  const chat = yield Chat.findByIdAndUpdate(chatId, { $set: { lastMessageId: message.id }});

  res.status(200).json(message);

  const redisMessage = {
    toUserId: chat.userIds.filter(id => id !== userId)[0],
    messageId: message.id,
    chatId: chatId,
  };

  redisPub.publish('r/new-message', JSON.stringify(redisMessage));
});
