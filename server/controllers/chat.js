import co from 'co';
import uniq from 'lodash/uniq';
import Message from '../models/Message';
import Chat from '../models/Chat';
import User from '../models/User';

const getAllUserIds = chats => chats.reduce((acc, chat) => acc.concat(chat.userIds), []);
const getAllUniqUserIds = chats => uniq(getAllUserIds(chats));

const getAllMessageIds = chats => chats.reduce((acc, chat) => acc.concat([chat.lastMessageId]), []);

export const getChats = co.wrap(function* (req, res) {
  const userId = req.user._id;
  const chats = yield Chat.find({ userIds: userId }).exec();
  const userIds = getAllUniqUserIds(chats);
  const messageIds = getAllMessageIds(chats);
  const { users, messages } = {
    users: yield User.find({ _id: { $in: userIds } }).exec(),
    messages: yield Message.find({ _id: { $in: messageIds } }).exec(),
  };

  res.status(200).json({ chats, users, messages });
})

export const createChat = (req, res) => {
  const userId = req.user._id;
  const { peerId } = req.body;

  const chat = new Chat({
    userIds: [userId, peerId],
  });

  chat.save()
    .then(chat => res.status(200).json(chat));
};

export const createChatByEmail = co.wrap(function* (req, res) {
  const userId = req.user._id;
  const peer = yield User.findOne({ email: req.body.email });

  if (peer === null) {
    return res.status(400).json({
      errors: {
        email: {
          message: 'There are no users with specified email',
        },
      },
    });
  }

  const peerId = peer._id;
  const existingChat = yield Chat.findOne({
    userIds: { $size: 2, $all:[userId, peerId] },
  });

  if (existingChat !== null) {
    return res.status(400).json({
      errors: {
        email: {
          message: 'You are already have chat with user with specified email',
        },
      },
    });
  }

  const chat = yield new Chat({
    userIds: [userId, peerId],
  }).save();

  return res.status(200).json(chat);
});
