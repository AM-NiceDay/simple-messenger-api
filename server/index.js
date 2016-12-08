import express from 'express';
import http from 'http';
import socket from 'socket.io';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import redis from 'redis';
import co from 'co';
import config from '../config';
import routes from './routes';

const app = express();
const port = process.env.PORT || 3000;
mongoose.connect(config.database);
mongoose.Promise = Promise;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use('/api/v1/', routes);


const redisSub = redis.createClient();
const server = http.Server(app);
const io = socket(server);

const getNewMessage = (clientUserId) => {
  return new Promise((resolve) => {
    redisSub.on('message', (channel, message) => {
      const newMessage = JSON.parse(message);
      console.log(`${clientUserId}: message for ${newMessage.toUserId}`);
      if (channel === 'r/new-message' && clientUserId === newMessage.toUserId) {
        resolve(newMessage);
      }
    });
  });
}

io.on('connection', (socket) => {
  socket.on('ws/listening', co.wrap(function* ({ userId }) {
    console.log(`Client ${userId} listening for incomming messages`);
    while (true) {
      const newMessage = yield getNewMessage(userId);
      console.log(`New message for client ${userId}: ${newMessage.messageId}`);
      socket.emit('ws/new-message', newMessage);
    }
  }));
});

redisSub.on('error', function (err) {
  console.log('Error:', err);
});

redisSub.subscribe('r/new-message');

module.exports = server;
