import { body, param } from 'express-validator';
import { passwordMatch, userIsBlocked, userIsTheCurrent, usernameExists } from './commonMethods.js';
import { findOtherUsersByEmail } from '../db/queries/userQueries.js';
import { postgresQuery } from '../db/postgres.js';
import { findFriendshipByIds } from '../db/queries/friendsQueries.js';
import { FriendStatus } from '../common/enums.js';
import { checkRequiredFields, getActiveUser, getThumbnailUrl, stringToBoolean } from '../common/utils.js';
import AppError from '../model/AppError.js';
import { unlink } from 'fs';

export const loginValidations = [
  body('username')
    .exists().withMessage('Username is required')
    .notEmpty().withMessage('Username cannot be empty')
    .custom(async username => {
      if (!(await usernameExists(username))) {
          throw new Error('Username does not exist');
      }
    }),
  body('password')
    .exists().withMessage('Password is required')
    .notEmpty().withMessage('Password cannot be empty')
    .isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
    .custom(async (password, {req}) => {
      const match = await passwordMatch(password, req.body.username);
      if (!match) {
        throw new Error('Invalid password or username');
      }
    }),
];

export const updateUserValidations = async (req, res, next) => {
  const body = Object.assign({}, req.body);

  try {
      let errorMessages = [];

      const required = [
        'username',
        'email',
        'name',
      ];
      const checkNulls = checkRequiredFields(body, required);
      if (!checkNulls) {
        errorMessages.push('Please fill mandatory fields.');
      }

      if (!(await usernameExists(body.username))) {
        errorMessages.push('Username does not exist');
      }
      if (!userIsTheCurrent(req, req.userId, 'id')) {
        errorMessages.push('Access denied for user ' + body.username);
      }

      if (await emailEditCheck(req)) {
        errorMessages.push('Email already in use');
      }

      if (stringToBoolean(body.changePasswordFlag)) {
        if (!body.password) {
          errorMessages.push('Password is required.');
        }

        if (!body.confirmPassword) {
          errorMessages.push('Password confirmation is required.');
        }

        if (body.password !== body.confirmPassword) {
          errorMessages.push('Passwords do not match.');
        }

        if (body.password && body.password.length < 5) {
          errorMessages.push('Password must be at least 5 characters long.');
        }
      }

      if (errorMessages.length > 0) {
        req.errorMessages = errorMessages;
      }
      next();
  } catch (e) {
      console.error('Error in update user validation:', e);
      res.status(500).json({ message: 'Error processing the request' });
  }
}

export const requestFriendValidations = [
  // check if username already exists
  body('friendId')
    .exists().withMessage('Friend ID is required')
    .notEmpty().withMessage('Friend ID cannot be empty')
    .custom(async (friendId, { req }) => {
      if (!(await usernameExists(friendId, 'id'))) {
          throw new Error('Friend ID does not exist');
      }
      if (userIsTheCurrent(req, friendId, 'id')) {
        throw new Error('Friend cannot be the same with current user');
      }
      const friendships = await alreadyFriends(req, friendId);
      if (friendships.length > 0) {
        const friendshipStatus = friendships[0].status;
        if (FriendStatus.ACCEPTED === friendshipStatus) {
          throw new Error('You are already friends with this user.');
        } else if (FriendStatus.PENDING === friendshipStatus) {
          throw new Error('You have already send request to this user.');
        } else if (FriendStatus.REQUESTED === friendshipStatus) {
          throw new Error('You have already a request from this user.');
        } else {
          throw new Error('Your friendship with this user has been blocked.');
        }
      }
    }),
]

export const acceptFriendValidations = [
  param('friendId')
    .exists().withMessage('Friend ID is required')
    .notEmpty().withMessage('Friend ID cannot be empty')
    .custom(async (friendId, { req }) => {
      if (!(await usernameExists(friendId, 'id'))) {
          throw new Error('Friend ID does not exist');
      }
      if (userIsTheCurrent(req, friendId, 'id')) {
        throw new Error('Friend cannot be the same with current user');
      }
      const friendships = await alreadyFriends(req, friendId);
      if (friendships.length > 0) {
        const friendshipStatus = friendships.find(f => f.status === FriendStatus.PENDING);
        if (!friendshipStatus) {
          throw new Error('Cannot accept friendship with this user.');
        } 
      } else {
        throw new Error('There is no requested friendship with this user.');
      }
    }),
]

export const deleteFriendValidations = [
  param('friendId')
    .exists().withMessage('Friend ID is required')
    .notEmpty().withMessage('Friend ID cannot be empty')
    .custom(async (friendId, { req }) => {
      if (!(await usernameExists(friendId, 'id'))) {
          throw new Error('Friend ID does not exist');
      }
      if (userIsTheCurrent(req, friendId, 'id')) {
        throw new Error('Friend cannot be the same with current user');
      }
      const friendships = await alreadyFriends(req, friendId);
      if (friendships.length === 0) {
        throw new Error('There is no friendship with this user.');
      }
    }),
]

export const blockFriendValidations = [
  param('friendId')
    .exists().withMessage('Friend ID is required')
    .notEmpty().withMessage('Friend ID cannot be empty')
    .custom(async (friendId, { req }) => {
      if (!(await usernameExists(friendId, 'id'))) {
          throw new Error('Friend ID does not exist');
      }
      if (userIsTheCurrent(req, friendId, 'id')) {
        throw new Error('Friend cannot be the same with current user');
      }
    }),
]

export const findUserByIdValidations = [
  param('id')
    .exists().withMessage('User id is required')
    .notEmpty().withMessage('User id cannot be empty')
    .custom(async (id, {req}) => {
      if (!(await usernameExists(id, 'id'))) {
          throw new Error('User ID does not exist');
      }
      if (await userIsBlocked(id, req.userId)) {
        throw new Error('Cannot access this user.');
      }
    }),
]

export const searchUserValidations = [
  param('text')
    .exists().withMessage('Search text is required')
    .notEmpty().withMessage('Search text cannot be empty'),
]

const emailEditCheck = async req => {
  const { username, email } = req.body;
  const res = await postgresQuery(findOtherUsersByEmail, [email, username]);
  return res.rows.length > 0;
}

const alreadyFriends = async (req, friendId) => {
  const activeUser = getActiveUser(req);
  if (activeUser == null) {
    throw new Error('No active user found');
  }
  const res = await postgresQuery(findFriendshipByIds, [activeUser.userId, friendId]);
  return res.rows;
}