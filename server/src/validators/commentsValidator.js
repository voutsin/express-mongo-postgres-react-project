import { body, param, query } from 'express-validator';
import { canAccessPost, commentExists, postExists } from './commonMethods.js';


export const addNewCommentValidations = [
    body('postId')
      .exists().withMessage('Post id is required')
      .notEmpty().withMessage('Post id cannot be empty')
      .custom(async (postId, { req }) => {
        const post = await postExists(postId);
        if (!post) {
            throw new Error('Cannot find post with this id.');
        }
        if (!(await canAccessPost(req.userId, postId, post.user_id))) {
            throw new Error('Cannot access post. You must be friends with user.');
        }
      }),
    body('content')
      .exists().withMessage('Please add something to comment.')
      .notEmpty().withMessage('Please add something to comment.'),
]

export const updateCommentValidations = [
    body('id')
      .exists().withMessage('Comment id is required')
      .notEmpty().withMessage('Comment id cannot be empty')
      .custom(async (id, { req }) => {
        const comment = await commentExists(id);
        if (!comment) {
            throw new Error('Cannot find comment with this id.');
        }
        if (comment.user_id !== parseInt(req.userId)) {
            throw new Error('Cannot access comment.');
        }
      }),
    body('content')
      .exists().withMessage('Please add something to comment.')
      .notEmpty().withMessage('Please add something to comment.'),
]

export const deleteCommentValidations = [
    param('id')
      .exists().withMessage('Comment id is required')
      .notEmpty().withMessage('Comment id cannot be empty')
      .custom(async (id, { req }) => {
        const comment = await commentExists(id);
        if (!comment) {
            throw new Error('Cannot find comment with this id.');
        }
        if (comment.user_id !== parseInt(req.userId)) {
            throw new Error('Cannot access comment.');
        }
      }),
]

export const viewCommentValidations = [
    param('id')
      .exists().withMessage('Comment id is required')
      .notEmpty().withMessage('Comment id cannot be empty')
      .custom(async (id, { req }) => {
        const comment = await commentExists(id);
        if (!comment) {
            throw new Error('Cannot find comment with this id.');
        }
      }),
];

export const viewPostCommentsValidations = [
  query('id')
    .exists().withMessage('Post id is required')
    .notEmpty().withMessage('Post id cannot be empty')
    .custom(async id => {
        if (!(await postExists(id))) {
            throw new Error('Post does not exist');
        }
    }),
  query('page')
    .exists().withMessage('Page number is required')
    .notEmpty().withMessage('Page number cannot be empty'),
  query('limit')
    .exists().withMessage('Number of results is required')
    .notEmpty().withMessage('Number of results cannot be empty')
]

export const viewCommentRepliesValidations = [
  query('id')
    .exists().withMessage('Comment id is required')
    .notEmpty().withMessage('Comment id cannot be empty')
    .custom(async id => {
        if (!(await commentExists(id))) {
            throw new Error('Comment does not exist');
        }
    }),
  query('page')
    .exists().withMessage('Page number is required')
    .notEmpty().withMessage('Page number cannot be empty'),
  query('limit')
    .exists().withMessage('Number of results is required')
    .notEmpty().withMessage('Number of results cannot be empty')
]

export const addNewReplyValidations = [
  body('commentId')
    .exists().withMessage('Comment id is required')
    .notEmpty().withMessage('Comment id cannot be empty')
    .custom(async (commentId, { req }) => {
      const comment = await commentExists(commentId);
      if (!comment) {
          throw new Error('Comment does not exist');
      }
      if (Boolean(comment.is_reply)) {
          throw new Error('Comment is already a reply.');
      }
    }),
  body('content')
    .exists().withMessage('Reply content is ewquired')
    .notEmpty().withMessage('Reply content cannot be empty'),
];