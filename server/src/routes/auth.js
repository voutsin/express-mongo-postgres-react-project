import express from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { postgresQuery } from "../db/postgres.js";
import { findByUserName, findUserById } from "../db/queries/userQueries.js";
import UserController from "../controller/UserController.js";
import { registerUserValidations } from "../validators/authValidator.js";
import { ACCESS_TOKEN_COOKIE, ACCESS_TOKEN_EXPIRE_TIME, REFRESH_TOKEN_COOKIE, REFRESH_TOKEN_EXPIRE_TIME, SECRET_KEY, getActiveUser } from "../common/utils.js";
import { authenticate } from "../validators/authenticate.js";
import { validationResult } from "express-validator";
import { userToResDto } from "../mapper/userMapper.js";

const authRouter = express.Router();

// login
authRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    const params = [username];
    const queryResult = await postgresQuery(findByUserName, params);
    // get first as username is unique
    const user = queryResult.rows[0];
    
    if (username == null || password == null) {
        return res.status(500).json({
            error: "Bad request.",
          });
    }

    // Compare the input password with the stored hash
    const match = await bcrypt.compare(password, user.password_hash);
    if (!user || !match) {
      return res.status(403).json({
        error: "invalid login",
      });
    }
    
    const authUser = {
        userId: user.id,
        username: user.username,
    }

    const accessToken = jwt.sign(authUser, SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXPIRE_TIME });
    const refreshToken = jwt.sign(authUser, SECRET_KEY, { expiresIn: REFRESH_TOKEN_EXPIRE_TIME });

    res.cookie(ACCESS_TOKEN_COOKIE, accessToken);
    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken);
    res.status(200)
        .json({
            success: true,
            data: userToResDto(user),
        });
});

authRouter.post('/refresh', (req, res) => {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];
    if (!refreshToken) {
      return res.status(401).send('Access Denied. No refresh token provided.');
    }
  
    try {
        const decoded = jwt.verify(refreshToken, SECRET_KEY);
        const authUser = {
            userId: decoded.id,
            username: decoded.username,
        }
        const accessToken = jwt.sign(authUser, SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXPIRE_TIME });
  
        res.cookie(ACCESS_TOKEN_COOKIE, accessToken);
        res.cookie(REFRESH_TOKEN_COOKIE, refreshToken);
        res.status(200)
            .json({
                success: true,
                data: {
                    userId: user.id,
                    email: user.email,
                },
            });

    } catch (error) {
      return res.status(401).send('Access Denied. Invalid refresh token.');
    }
});

// Route to verify the authentication
authRouter.get('/verify', authenticate, async (req, res) => {
    try {
        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.json({ success: false, errors: errors.array() });
        }

        const authUser = getActiveUser(req);

        const userResults = await postgresQuery(findUserById, [authUser.id])

        res.json({ authUser: userToResDto(userResults.rows[0]), success: true });
    } catch (e) {
        console.log("errors:", e)
        res.status(500).send(e);
    }
  });

authRouter.post('/logout', async (req, res, next) => {
    res.clearCookie(ACCESS_TOKEN_COOKIE);
    res.clearCookie(REFRESH_TOKEN_COOKIE);
    res.status(200).send('Logout successful');
});

authRouter.post('/register', registerUserValidations, UserController.registerNewUser);

export default authRouter;