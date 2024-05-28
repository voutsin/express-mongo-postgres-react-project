import express from 'express';
import connectToMongoDB from './db/mongo.js';
import messagesRouter from './routes/messages.js';
import usersRouter from './routes/users.js';
import dotenv from "dotenv";
dotenv.config();

const app = express();

const mongoDb = connectToMongoDB();

app.use('/users', usersRouter);
app.use('/messages', messagesRouter);

const port = process.env.SERVER_PORT;
app.listen(port, () => {
  console.log('Server is running on port ', port);
});