import Chat from '../models/Chat';

export const getChats = (req, res) => {
  const userId = req.user.sub;

  Chat.find({ userIds: userId })
    .exec()
    .then(chats => res.status(200).json(chats));
};

export const createChat = (req, res) => {
  const userId = req.user.sub;
  const { peerId } = req.body;

  const chat = new Chat({
    userIds: [userId, peerId],
  });

  chat.save()
    .then(chat => res.status(200).json(chat));
};
