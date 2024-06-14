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
// import WebSocket, {WebSocketServer} from 'ws';

dotenv.config();

const app = express();

// // Middleware to parse JSON bodies
// app.use(express.json());
// // Middleware for parsing form-data bodies
// app.use(express.urlencoded({ extended: true }));

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// Use the cookie-parser middleware
app.use(cookieParser());

connectToMongoDB();

app.use('/auth', authRouter);

// Serve static files from the "uploads" directory
// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/uploads', express.static(join(__dirname, 'uploads')));

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

const port = process.env.SERVER_PORT;
const server = app.listen(port, () => {
  console.log('Server is running on port ', port);
});

// web socker server must be separate from api
// few api routes that we expose
// const wsServer = new WebSocketServer({ noServer: true} );

// const onSocketPreError = e => {
//   console.log("Pre Socket Error: ", e);
// }

// const onSocketPostError = e => {
//   console.log("Post Socket Error: ", e);
// }

// server.on('upgrade', (req, socket, head) => {
//   socket.on('error', onSocketPreError);

//   // perform auth
//   if (!req.headers['NoAuth']) {
//     socket.write('401 Unauthorized!');
//     socket.destroy();
//     return;
//   }

//   // http handling error
//   wsServer.handleUpgrade(req, socket, head, (ws) => {
//     socket.removeListener('error', onSocketPreError);
//     wsServer.emit('connection', ws, req);
//   });
// });

// wsServer.on('connection', (ws, req) => {
//   // web socket handling error
//   ws.on('error', onSocketPostError);

//   ws.on('message', (msg, isBinary) => {
//     wsServer.clients.forEach(client => {
//       if (ws !== client && client.readyState === WebSocket.OPEN) {
//         client.send(msg, { binary: isBinary});
//       }
//     })
//   });

//   ws.on('close', () => {
//     console.log("Connection closed.");
//   });
// })