import express from 'express';
import connectToMongoDB from './db/mongo.js';
import messagesRouter from './routes/messages.js';
import usersRouter from './routes/users.js';
import dotenv from "dotenv";
import authRouter from './routes/auth.js';
import cookieParser from 'cookie-parser';
import { authenticate } from './validators/authenticate.js';
import friendsRouter from './routes/friends.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import postsRouter from './routes/posts.js';
import bodyParser from 'body-parser';
import feedsRouter from './routes/feeds.js';
import commentsRouter from './routes/comments.js';
import reactionsRouter from './routes/reactions.js';
import searchRouter from './routes/search.js';
import cors from 'cors';
import { access, constants } from 'fs';
import { globalErrorHandler } from './common/utils.js';
import AppError from './model/AppError.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { socketAuthenticateMiddleware } from './socket/utils.js';
import socketChatHandler from './socket/socketChatHandler.js';
import { findAllUserMessageGroups } from './db/repositories/MessageGroupRepository.js';

dotenv.config();

const app = express();
const server = createServer(app);
// Use cors middleware
app.use(cors({
  origin: (origin, callback) => {
    callback(null, origin); // Allow all origins
  },
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// Use the cookie-parser middleware
app.use(cookieParser());

connectToMongoDB();

//An error handling middleware
app.use(function (err, req, res, next) {
  res.status(500);
  res.send("Oops, something went wrong. ", err)
});

app.use('/auth', authRouter);

// Serve static files from the "uploads" directory
// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get('/uploads/:userId/:filename', (req, res) => {
  const { userId, filename } = req.params;
  const filepath = join(__dirname, '..', 'uploads', userId, filename);

  // Check if the file exists
  access(filepath, constants.F_OK, (err) => {
      if (err) {
          // Send a 404 response if the file is not found
          return res.status(404).json({ message: 'File not found' });
      }

      // Send the file if it exists
      res.sendFile(filepath);
  });
});

// apply authenticate jwt token middleware
app.use(authenticate);

// all the routes after authenticate use will use this middleware
app.use('/users', usersRouter);
app.use('/friends', friendsRouter);
app.use('/messages', messagesRouter);
app.use('/posts', postsRouter);
app.use('/feed', feedsRouter);
app.use('/comments', commentsRouter);
app.use('/reactions', reactionsRouter);
app.use('/search', searchRouter);


// Handling all undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


// Use the global error handling middleware
app.use(globalErrorHandler);

const port = process.env.SERVER_PORT;


// Initialize the socket.io instance
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // allowedHeaders: ["Content-Type"],
    credentials: true
  }
});

io.use(socketAuthenticateMiddleware);

const { sendMessage, getGroupMessages, disconnect, } = socketChatHandler(io);

const onConnection = async (socket) => {
  console.log('New client connected:', socket.authUser);

  if (socket.authUser) {
    try {
        // Get the user's groups
        const userGroups = await findAllUserMessageGroups(socket.authUser.userId);
        // Join each group room
        userGroups.forEach(group => {
            socket.join(group.id.toString());
        });
    } catch (error) {
        console.error('Error fetching user groups:', error);
    }
  }

  socket.on("send_message", sendMessage);
  socket.on("get_messages", getGroupMessages);
  socket.on('disconnect', disconnect);
}
io.on("connection", onConnection);


server.listen(port, () => {
  console.log('Server is running on port ', port);
});