import mongoose from 'mongoose';
import ChatSchema from './Chat';
import MessageSchema from './Message';
import UserSchema from './User';

mongoose.model('Chat', ChatSchema);
mongoose.model('Message', MessageSchema);
mongoose.model('User', UserSchema);
