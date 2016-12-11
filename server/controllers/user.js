import co from 'co';
import bcrypt from 'bcrypt';
import User from '../models/User';

export const getUsers = co.wrap(function* (req, res) {
  const users = yield User.find().exec();

  res.status(200).json(users);
});

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
