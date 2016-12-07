import Message from '../models/Message';
import Chat from '../models/Message';

export const getChatMessages = (req, res) => {
  const userId = req.user._id;
  const { chatId } = req.params;

  Message.find({ chatId: chatId }).exec()
    .then(messages => res.status(200).json(messages));
};

export const createChatMessage = (req, res) => {
  const userId = req.user._id;
  const { chatId } = req.params;
  const { text } = req.body;

  const message = new Message({
    chatId,
    userId,
    text,
  });

  message.save()
    .then(message => {
      return Chat.findByIdAndUpdate(chatId, {
        lastMessageId: message.id,
      })
        .then(() => message);
    })
    .then(message => res.status(200).json(message));
};
