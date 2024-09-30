import { body } from 'express-validator';
import { emailExists, usernameExists } from './commonMethods.js';

export const registerUserValidations = [ 
    // Check if the email is valid
    body('email')
      .exists().withMessage('Email is required')
      .notEmpty().withMessage('Email cannot be empty')
      .isEmail().withMessage('Email is invalid')
      // Custom validator for checking if email already exists
      .custom(async (email) => {
        if (await emailExists(email)) {
          throw new Error('Email already in use');
        }
      }),
    // Password must be at least 5 chars long
    body('password')
      .exists().withMessage('Password is required')
      .notEmpty().withMessage('Password cannot be empty')
      .isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
    // check if username already exists
    body('username')
      .exists().withMessage('Username is required')
      .notEmpty().withMessage('Username cannot be empty')
      .custom(async username => {
        if (await usernameExists(username)) {
            throw new Error('Username already in use');
        }
      }),
    body('name')
      .exists().withMessage('Name is required')
      .notEmpty().withMessage('Name cannot be empty'),
];