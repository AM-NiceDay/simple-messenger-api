import co from 'co';
import redis from 'redis';
import config from '../../config';
import Message from '../models/Message';
import Chat from '../models/Chat';
import User from '../models/User';

const redisPub = redis.createClient({ host: config.redisHost });

export const getChatMessages = co.wrap(function* (req, res) {
  const userId = req.user._id;
  const { chatId } = req.params;

  const messages = yield Message.find({ chatId: chatId }).exec();
  const chat = yield Chat.findById(chatId);
  const users = yield User.find({ _id: { $in: chat.userIds } });

  res.status(200).json({ messages, chats: [chat], users });
});

export const createChatMessage = co.wrap(function* (req, res) {
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
    type: 'message',
    toUserId: chat.userIds.filter(id => id !== userId)[0],
    messageId: message.id,
    chatId: chatId,
  };

  redisPub.publish('r/new-message', JSON.stringify(redisMessage));
});
