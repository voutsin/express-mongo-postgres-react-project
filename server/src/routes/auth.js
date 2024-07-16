import express from "express";
import jwt from 'jsonwebtoken';
import { postgresQuery } from "../db/postgres.js";
import { findByUserName, findUserById } from "../db/queries/userQueries.js";
import UserController from "../controller/UserController.js";
import { registerUserValidations } from "../validators/authValidator.js";
import { ACCESS_TOKEN_COOKIE, ACCESS_TOKEN_EXPIRE_TIME, REFRESH_TOKEN_COOKIE, REFRESH_TOKEN_EXPIRE_TIME, SECRET_KEY, asyncHandler, getActiveUser } from "../common/utils.js";
import { authenticate } from "../validators/authenticate.js";
import { userToResDto } from "../mapper/userMapper.js";
import { loginValidations } from "../validators/userValidator.js";

const authRouter = express.Router();

// login
authRouter.post('/login', loginValidations, asyncHandler(async (req, res, next) => {
    const { username } = req.body;
    const params = [username];
    const queryResult = await postgresQuery(findByUserName, params);
    // get first as username is unique
    const user = queryResult.rows[0];
    
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
}));

authRouter.post('/refresh', asyncHandler(async (req, res, next) => {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];
    if (!refreshToken) {
      next(new AppError('Access Denied. No refresh token provided.', 401));
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
      next(new AppError('Access Denied. Invalid refresh token.', 401));
    }
}));

// Route to verify the authentication
authRouter.get('/verify', authenticate, asyncHandler(async (req, res, next) => {
    try {
        const authUser = getActiveUser(req);

        const userResults = await postgresQuery(findUserById, [authUser.id])

        res.json({ authUser: userToResDto(userResults.rows[0]), success: true });
    } catch (e) {
      next(new AppError(e, 500));
    }
}));

authRouter.post('/logout', async (req, res, next) => {
    res.clearCookie(ACCESS_TOKEN_COOKIE);
    res.clearCookie(REFRESH_TOKEN_COOKIE);
    res.status(200).send('Logout successful');
});

authRouter.post('/register', registerUserValidations, UserController.registerNewUser);

export default authRouter;