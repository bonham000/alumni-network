import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import passportRoute from './server/routes/passport';
import user from './server/routes/user';
import community from './server/routes/community';
import chat from './server/routes/chat';
import privateChat from './server/routes/private-chat';
import gitLabRoute from './server/helpers/gitLabRoute';

dotenv.config();

const APP_HOST = 'https://safe-cliffs-78756.herokuapp.com/';
export const CLIENT_URL = process.env.PROD ? APP_HOST : 'http://localhost:3000/';
export const SERVER_URL = process.env.PROD ? APP_HOST : 'http://localhost:8080/';

// try to initialize redis
const startRedis = () => {
  if (process.env.REDISTOGO_URL) {
    var rtg = require("url").parse(process.env.REDISTOGO_URL);
    var client = require("redis").createClient(rtg.port, rtg.hostname);
    client.auth(rtg.auth.split(":")[1]);
  } else {
    var client = require("redis").createClient();
  }
  return client;
}

export const client = startRedis();

client.on('error', (err) => console.log(`Redis Error: ${err}`));
client.on('ready', () => console.log('Redis connected'));

// initialize mongoDB
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGO_URL, () => console.log('Mongoose connected'));

/*=========== Populating DB with user data =====>
This will only save users if they don't exist locally yet */
require('./server/helpers/mockData');

// initialize Express app and setup routes
const app = express();
app.use(bodyParser.json());

app.use(passportRoute);
app.use(user);
app.use(community);
app.use(chat);
app.use(privateChat);
app.use(gitLabRoute);

// server main app and statis assets:
app.use(express.static(path.join(__dirname, '/client/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

// initialize Express server
const port = process.env.PORT || 8080;
const server = app.listen(port, () => console.log(`Express Server is listening on port ${port}`));

// initialize Socket.io chat server
const io = require('socket.io')(server);
require('./server/chat/chat.js')(io);
