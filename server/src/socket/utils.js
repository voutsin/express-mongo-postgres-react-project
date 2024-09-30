import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, SECRET_KEY } from "../common/utils.js";
import AppError from "../model/AppError.js";
import { MessageStatus } from '../common/enums.js';
import { activeUsers, io } from '../server.js';
import { notificationToResDto } from '../mapper/notificationMapper.js';

export const socketAuthenticateMiddleware = (socket, next) => {
    // only triggered when the client tries to reach the main namespace
    const req = socket.handshake;
    const accessToken = req.auth[ACCESS_TOKEN_COOKIE];
    const refreshToken = req.auth[REFRESH_TOKEN_COOKIE];

    // if no token are present 
    if (!accessToken && !refreshToken) {
      next(new AppError('Access Denied. No tokens provided.', 401));
    }

    try {
      // decode ACCESS TOKEN
      jwt.verify(accessToken, SECRET_KEY);
      next();
    } catch (error) {
      // check for refresh token
      if (!refreshToken) {
        next(new AppError('Access Denied. No refresh token provided.', 401));
      }

      // verify refresh token
      jwt.verify(refreshToken, SECRET_KEY, (err, user) => {
        if (err) {
          next(new AppError('Access Denied. Invalid refresh token', 401));
        }

        // if no errors
        const authUser = user ? {
          userId: user.userId,
          username: user.username
        } : null;

        socket.authUser = authUser;
        next();
      });
    }
};

export const socketErrorCallback = e => ({
    status: MessageStatus.FAILED,
    message: {errors: [e]}
});

export const emitNotification = (userId, notification, eventName) => {
  try {
    const targetSocket = [...activeUsers.values()].find(user => user.userId === userId);
    if (targetSocket) {
      const response = {
        idsToBeDeleted: notification.idsToBeDeleted && notification.idsToBeDeleted.map(id => id._id),
        notification: notificationToResDto(notification),
        status: MessageStatus.SENT
      };
      io.to(targetSocket.socketId).emit(eventName, response);
    }
  } catch (e) {
    console.log('SOCKET ERROR: ', e)
    io.emit('error_message', {
      error: e,
      status: MessageStatus.FAILED
    });
  }
}