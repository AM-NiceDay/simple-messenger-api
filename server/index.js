import express from 'express';
import http from 'http';
import socket from 'socket.io';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import redis from 'redis';
import co from 'co';
import './models';
import config from '../config';
import routes from './routes';

const app = express();
const port = process.env.PORT || 3000;
mongoose.connect(config.mongoHost);
mongoose.Promise = Promise;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use('/api/v1/', routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong');
});


const redisSub = redis.createClient({ host: config.redisHost });
const server = http.Server(app);
const io = socket(server);

const getNewMessage = (clientUserId) => {
  return new Promise((resolve) => {
    redisSub.on('message', (channel, message) => {
      const newMessage = JSON.parse(message);
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
      console.log(`New message for client ${userId}`);
      if (newMessage.type === 'message') {
        socket.emit('ws/new-message', newMessage);
      } else if (newMessage.type === 'chat') {
        socket.emit('ws/new-chat', newMessage);
      }
    }
  }));
});

redisSub.on('error', function (err) {
  console.log('Error:', err);
});

redisSub.subscribe('r/new-message');

module.exports = server;
