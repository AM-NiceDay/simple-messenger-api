import co from 'co';
import bcrypt from 'bcrypt';
import User from '../models/User';

export const createUser = co.wrap(function* (req, res) {
  const { email, password } = req.body;
  const hash = yield bcrypt.hash(password, 10);
  const user = yield new User({ email, password: hash }).save();
  res.status(200).json(user);
});
