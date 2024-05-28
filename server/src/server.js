import express from 'express';
import connectToMongoDB from './db/mongo.js';
import messagesRouter from './routes/messages.js';
import usersRouter from './routes/users.js';

const app = express();

const mongoDb = connectToMongoDB();

app.use('/users', usersRouter);
app.use('/messages', messagesRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});