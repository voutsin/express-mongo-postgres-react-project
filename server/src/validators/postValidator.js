import { param } from 'express-validator';
import { postExists, userIsTheCurrent, usernameExists } from './commonMethods.js';
import { getActiveUser } from '../common/utils.js';
import { postgresQuery } from '../db/postgres.js';
import { findPostByIdSQL } from '../db/queries/postsQueries.js';
import { PostType } from '../common/enums.js';

export const findPostValidations = [
  param('id')
    .exists().withMessage('Post id is required')
    .notEmpty().withMessage('Post id cannot be empty')
    .custom(async id => {
        if (!(await postExists(id))) {
            throw new Error('Post does not exist');
        }
    }),
]

export const findUserPostsValidations = [
    param('id')
      .exists().withMessage('User id is required')
      .notEmpty().withMessage('User id cannot be empty')
      .custom(async id => {
        if (!(await usernameExists(id, 'id'))) {
            throw new Error('User id does not exist');
        }
      }),
]

export const deletePostValidations = [
    param('id')
      .exists().withMessage('Post id is required')
      .notEmpty().withMessage('Post id cannot be empty')
      .custom(async (id, { req }) => {
        const posts = await postgresQuery(findPostByIdSQL, [id]);
        const postExists = posts.rows.length > 0;
        if(!postExists) {
            throw new Error('Post does not exist');
        }
        const userId = posts.rows[0].user_id.toString();
        if (!userIsTheCurrent(req, userId, 'id')) {
            throw new Error('Cannot access this post.');
        }
      }),
]

export const addNewPostValidations = req => {
    const body = Object.assign({}, req.body);
    return {
        result: (body.postType === PostType.STATUS ? body.content != null : true) && body.postType != null,
        message: 'Please fill mandatory fields.',
    };
}

export const updatePostValidations = async req => {
    let errorMessage = null;
    let result = true;
    const body = Object.assign({}, req.body);

    try {
        const alreadyPost = await postgresQuery(findPostByIdSQL, [body.id]);
        const post = alreadyPost.rows[0];
        const activeUser = getActiveUser(req);
        if (activeUser == null) {
            throw new Error('No active user found');
        }

        const checkNulls = (body.postType === PostType.STATUS ? body.content != null : true) && body.postType != null;
        if (!checkNulls) {
            errorMessage = 'Please fill mandatory fields.';
        }
        const checkAlreadyPost = alreadyPost.rows.length > 0;
        if (!checkAlreadyPost) {
            errorMessage = 'No post found with this id.';
        }
        const checkActiveUserIdPostUser = post && post.user_id.toString() === activeUser.id;
        if (!checkActiveUserIdPostUser) {
            errorMessage = 'You have no access to edit this post.';
        }
        result = checkNulls && checkAlreadyPost && checkActiveUserIdPostUser;
    } catch (e) {
        errorMessage = e;
        result = false;
    }

    return {
        result,
        message: errorMessage,
    };
}