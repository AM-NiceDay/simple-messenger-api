import mongoose from 'mongoose';
import co from 'co';
import bcrypt from 'bcryptjs';
import uniq from 'lodash/uniq';

const Chat = mongoose.model('Chat');
const User = mongoose.model('User');

const getAllUserIds = chats => chats.reduce((acc, chat) => acc.concat(chat.userIds), []);
const getAllUniqUserIds = chats => uniq(getAllUserIds(chats));

export const getUsers = co.wrap(function* (req, res) {
  const users = yield User.find().exec();

  res.status(200).json(users);
});

export const getUsersSearch = co.wrap(function* (req, res) {
  const userId = req.user._id;
  const userChats = yield Chat.find({ userIds: userId });
  const knownUserIds = getAllUniqUserIds(userChats);
  console.log([userId, ...knownUserIds]);
  const users = yield User.find({
    _id: { $nin: [userId, ...knownUserIds] },
  }).exec();

  res.status(200).json(users);
})

export const createUser = co.wrap(function* (req, res) {
  const { email, password } = req.body;
  const hash = yield bcrypt.hash(password, 10);

  try {
    const user = yield new User({ email, password: hash }).save();
    return res.status(200).json(user);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({
        errors: {
          email: {
            message: 'User with this email already exists',
          },
        },
      });
    }

    throw err;
  }
});
