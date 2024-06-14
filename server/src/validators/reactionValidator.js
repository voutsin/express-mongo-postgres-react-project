import { body, param } from 'express-validator';
import { canAccessPost, commentExists, postExists, reactionExists } from './commonMethods.js';

export const addNewReactionValidations = [
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
        // already reaction for this post
        const isPostReaction = req.body.commentId == null;
        const alreadyPostReaction = req.postReaction != null;
        if (alreadyPostReaction && isPostReaction) {
            throw new Error('There is already a reaction for this post by you.');
        }
      }),
    body('commentId')
      .custom(async (commentId, { req }) => {
        if (commentId) {
            // comment belongs to post
            const comment = await commentExists(commentId);
            if (!comment) {
                throw new Error('Cannot find this comment.');
            }
            if (comment.post_id !== req.body.postId) {
                throw new Error('Comment id does not match with post id.');
            }
            // already reaction for this comment
            const alreadyCommentReaction = req.commentReaction != null;
            if (alreadyCommentReaction) {
                throw new Error('There is already a reaction for this comment by you.');
            }
        }
      }),
    body('reactionType')
      .exists().withMessage('Reaction type is required.')
      .notEmpty().withMessage('Reaction type is required.'),
]

export const updateReactionValidations = [
    body('id')
      .exists().withMessage('Reaction id is required')
      .notEmpty().withMessage('Reaction id cannot be empty')
      .custom(async (id, { req }) => {
        const reaction = await reactionExists(id);
        if (!reaction) {
            throw new Error('Cannot find reaction with this id.');
        }
        if (reaction.user_id !== parseInt(req.userId)) {
            throw new Error('Cannot access reaction.');
        }
      }),
    body('reactionType')
      .exists().withMessage('Reaction type is required.')
      .notEmpty().withMessage('Reaction type is required.'),
]

export const deleteReactionValidations = [
    param('id')
      .exists().withMessage('Reaction id is required')
      .notEmpty().withMessage('Reaction id cannot be empty')
      .custom(async (id, { req }) => {
        const reaction = await reactionExists(id);
        if (!reaction) {
            throw new Error('Cannot find reaction with this id.');
        }
        if (reaction.user_id !== parseInt(req.userId)) {
            throw new Error('Cannot access reaction.');
        }
      }),
]