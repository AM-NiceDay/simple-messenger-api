import co from 'co';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config';
import User from '../models/User';

export const jwtCheck = (req, res, next) => {
  const token = req.get('Authorization').split('Bearer ')[1];

  if (!token) {
    return res.status(403).json({
      message: 'No token provided.',
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Failed to authenticate token.' })

    req.user = decoded.user;
    next();
  })
};

export const authenticate = co.wrap(function* (req, res){
  const user = yield User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({ message: 'Authentication failed. User not found.' });
  }

  const isPasswordMatch = yield bcrypt.compare(req.body.password, user.password);
  if (!isPasswordMatch) {
    return res.status(400).json({ message: 'Authentication failed. Wrong password.' });
  }

  const token = jwt.sign({ user }, config.secret);

  res.status(200).json(Object.assign({}, user.toObject(), { token }));
});
