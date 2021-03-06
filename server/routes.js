import { Router } from 'express';
import { authenticate, jwtCheck } from './controllers/auth';
import { getUsers, getUsersSearch, createUser } from './controllers/user';
import { getChats, createChat, createChatByEmail, updateChatLastRead } from './controllers/chat';
import { getChatMessages, createChatMessage } from './controllers/message';

const router = Router();

router.post('/auth', authenticate);
router.get('/users', getUsers);
router.get('/users/search', jwtCheck, getUsersSearch);
router.post('/users', createUser);

router.get('/chats', jwtCheck, getChats);
router.post('/chats', jwtCheck, createChat);
router.post('/chatsByEmail', jwtCheck, createChatByEmail);
router.put('/chats/:chatId/lastRead', jwtCheck, updateChatLastRead);

router.get('/chats/:chatId/messages', jwtCheck, getChatMessages);
router.post('/chats/:chatId/messages', jwtCheck, createChatMessage);

router.get('/ping', (req, res) => {
  res.send('pong');
});

export default router;
