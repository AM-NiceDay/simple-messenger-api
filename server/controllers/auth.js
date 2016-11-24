import jwt from 'jsonwebtoken';
import config from '../../config';
import User from '../models/User';

export const ensureAuthenticated = (req, res, next) => {
  const token = req.body.token;

  if (!token) {
    return res.status(403).json({
      message: 'No token provided.',
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Failed to authenticate token.' })

    req.user = user;
    next();
  })
};

export const authenticate = (req, res) => {
  User.findOne({
    name: req.body.name,
  })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'Authentication failed. User not found.' });
      }

      if (user.password !== req.body.password) {
        return res.status(400).json({ message: 'Authentication failse. Wrong password.' });
      }

      const token = jwt.sign(user, config.secret);

      res.status(200).json({
        token,
      });
    })
    .catch(err => console.log(err));
};
