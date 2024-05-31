import { body } from 'express-validator';
import { postgresQuery } from '../db/postgres.js';
import { findByEmail, findByUserName } from '../db/queries/userQueries.js';

export const registerUserValidations = [
      // Check if the email is valid
      body('email').isEmail().withMessage('Email is invalid')
        // Custom validator for checking if email already exists
        .custom(async (email) => {
          if (await emailExists(email)) {
            throw new Error('Email already in use');
          }
        }),
      // Password must be at least 5 chars long
      body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
      // check if username already exists
      body('username').custom(async username => {
        if (await usernameExists(username)) {
            throw new Error('Username already in use');
        }
      })
];

const emailExists = async email => {
    const res = await postgresQuery(findByEmail, [email]);
    return res.rows.length > 0;
}

const usernameExists = async username => {
    const res = await postgresQuery(findByUserName, [username]);
    return res.rows.length > 0;
}