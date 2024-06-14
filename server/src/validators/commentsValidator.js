import { body, param } from 'express-validator';
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

export const viewCommentVlidations = [
    param('id')
      .exists().withMessage('Comment id is required')
      .notEmpty().withMessage('Comment id cannot be empty')
      .custom(async (id, { req }) => {
        const comment = await commentExists(id);

        if (!comment) {
            throw new Error('Cannot find comment with this id.');
        }
      }),
]

const commentPostUserIsFriend = async (req, comment) => {
    
}