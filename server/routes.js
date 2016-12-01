import { Router } from 'express';
import jwt from 'express-jwt';
import Chat from './models/Chat';

const router = Router();

const jwtCheck = jwt({
  secret: new Buffer('TyDao7Z2NvjbybR0yN0jrdIxQhMHLh5EIOPfyQ_17j1mF-3r2vi_u8wnIp0Xnjw5', 'base64'),
  audience: 'uA4jpUU4udP87jShFTvZH6jSkH5PG8Os'
});

router.get('/chats', jwtCheck, (req, res) => {
  const userId = req.user.sub;

  Chat.find({ userIds: userId })
    .exec()
    .then(chats => res.status(200).json(chats));
})

router.post('/chats', jwtCheck, (req, res) => {
  const userId = req.user.sub;
  const { peerId } = req.body;

  const chat = new Chat({
    userIds: [userId, peerId],
  });

  chat.save()
    .then(chat => res.status(200).json(chat));
})

router.get('/ping', (req, res) => {
  res.send('pong');
});

export default router;
