import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import config from '../config';
import routes from './routes'

const app = express();
const port = process.env.PORT || 3000;
mongoose.connect(config.database);
mongoose.Promise = Promise;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use('/api/v1/', routes);

module.exports = app;
