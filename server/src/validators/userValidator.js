import { body, param } from 'express-validator';
import { userIsTheCurrent, usernameExists } from './commonMethods.js';
import { findOtherUsersByEmail } from '../db/queries/userQueries.js';
import { postgresQuery } from '../db/postgres.js';
import { findFriendshipByIds } from '../db/queries/friendsQueries.js';
import { FriendStatus } from '../common/enums.js';
import { getActiveUser } from '../common/utils.js';

export const updateUserValidations = [
  // check if username already exists
  body('username')
    .exists().withMessage('Username is required')
    .notEmpty().withMessage('Username cannot be empty')
    .custom(async (username, { req }) => {
      if (!(await usernameExists(username))) {
          throw new Error('Username does not exist');
      }
      if (!userIsTheCurrent(req, username, 'username')) {
        throw new Error('Access denied for user ' + username);
      }
    }),
  // Check if the email is valid
  body('email')
    .exists().withMessage('Email is required')
    .notEmpty().withMessage('Email cannot be empty')
    .custom(async (email, { req }) => {
      if (await emailEditCheck(req)) {
        throw new Error('Email already in use');
      }
    }),
  body('password')
    .exists().withMessage('Password is required')
    .notEmpty().withMessage('Password cannot be empty')
    .isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
  body('name')
    .exists().withMessage('Name is required')
    .notEmpty().withMessage('Name cannot be empty'),
]

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
        const friendshipStatus = friendships[0].status;
        if (FriendStatus.REQUESTED !== friendshipStatus) {
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
    .custom(async id => {
      if (!(await usernameExists(id, 'id'))) {
          throw new Error('User ID does not exist');
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