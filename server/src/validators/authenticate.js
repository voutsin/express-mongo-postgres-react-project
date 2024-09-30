import { ACCESS_TOKEN_COOKIE, ACCESS_TOKEN_EXPIRE_TIME, REFRESH_TOKEN_COOKIE, SECRET_KEY } from "../common/utils.js";
import jwt from 'jsonwebtoken';
import AppError from "../model/AppError.js";

export const authenticate = (req, res, next) => {
  const accessToken = req.cookies[ACCESS_TOKEN_COOKIE];
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];

  // if no token are present 
  if (!accessToken && !refreshToken) {
    next(new AppError('Access Denied. No tokens provided.', 401));
  }

  try {
    // decode ACCESS TOKEN
    jwt.verify(accessToken, SECRET_KEY);
    res
        .cookie(REFRESH_TOKEN_COOKIE, refreshToken)
        .cookie(ACCESS_TOKEN_COOKIE, accessToken);
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
      const authUser = {
        userId: user.userId,
        username: user.username
      }

      const accessToken = jwt.sign(authUser, SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXPIRE_TIME });
      
      req.authUser = authUser;
      res
        .cookie(REFRESH_TOKEN_COOKIE, refreshToken)
        .cookie(ACCESS_TOKEN_COOKIE, accessToken);
        next();
    });
  }
};