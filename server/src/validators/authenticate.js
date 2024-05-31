import { ACCESS_TOKEN_COOKIE, ACCESS_TOKEN_EXPIRE_TIME, REFRESH_TOKEN_COOKIE, SECRET_KEY } from "../routes/auth.js";
import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const accessToken = req.cookies[ACCESS_TOKEN_COOKIE];
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];

  // if no token are present 
  if (!accessToken && !refreshToken) {
    return res.status(401).send('Access Denied. No tokens provided.');
  }

  try {
    // decode ACCESS TOKEN
    jwt.verify(accessToken, SECRET_KEY);
    next();
  } catch (error) {
    // check for refresh token
    if (!refreshToken) {
      return res.status(401).send('Access Denied. No refresh token provided.');
    }

    // verify refresh token
    jwt.verify(refreshToken, SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(401).send('Access Denied. Invalid refresh token');
      }

      // if no errors
      const authUser = {
        userId: user.userId,
        username: user.username
      }

      const accessToken = jwt.sign(authUser, SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXPIRE_TIME });
      
      res
        .cookie(REFRESH_TOKEN_COOKIE, refreshToken, { httpOnly: true, sameSite: 'strict' })
        .cookie(ACCESS_TOKEN_COOKIE, accessToken, { httpOnly: true, sameSite: 'strict' });
        next();
    });
  }
};