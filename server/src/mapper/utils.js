import { ReactionType } from "../common/enums.js";
import { postgresQuery } from "../db/postgres.js"
import { selectCountOfPostCommentsSQL } from "../db/queries/commentsQueries.js";
import { findPostByIdSQL } from "../db/queries/postsQueries.js";
import { commentToResDto } from "./commentMapper.js";
import { postToResDto } from "./postMapper.js";
import { reactionToResDto } from "./reactionMapper.js";
import { userToResDto } from "./userMapper.js";
import { uniq } from 'underscore';

export const findDetailedLists = async (postId) => {
    // queries
    const postResults = await postgresQuery(findPostByIdSQL, [postId]);
    const allPosts = [...postResults.rows];
    const commentParams = uniq(allPosts.map(post => post.id)).toString();
    const commentResults = commentParams.length > 0 ? await postgresQuery(`SELECT * FROM comments WHERE post_id IN (${commentParams});`) : {rows: []};
    const allComments = [...commentResults.rows];
    const reactionResults = await findReactions(allPosts, allComments);
    const userResults = await findUsers(allPosts, allComments, reactionResults);

    // lists
    const users = userResults.map(user => userToResDto(user));
    const reactions = reactionResults.map(reaction => ({
            ...reaction,
            user: users.find(user => user.id === reaction.userId)
        }));
    const comments = mapComments(allComments, users, reactions);
    const posts = mapPosts(allPosts, users, comments, reactions);

    return {
        users, posts, comments, reactions
    }
}

export const findFeedDetails = async postId => {
    // queries
    const postResults = await postgresQuery(findPostByIdSQL, [postId]);
    const allPosts = [...postResults.rows];
    const reactionResults = await findReactions(allPosts, []);
    const userResults = await findUsers(allPosts, [], reactionResults);

    // lists
    const users = userResults.map(user => userToResDto(user));
    const reactions = reactionResults.map(reaction => ({
            ...reaction,
            user: users.find(user => user.id === reaction.userId)
        }));
    const posts = await mapPosts(allPosts, users, [], reactions);

    return {
        users, posts, reactions
    }
}

export const findReactions = async (posts = [], comments = []) => {
    const postParams = uniq(posts.map(post => post.id)).toString();
    const postsReactionsRes = await postgresQuery(`SELECT * FROM reactions WHERE post_id IN (${postParams}) AND comment_id IS NULL;`);

    const commentParams = uniq(comments.map(comment => comment.id)).toString();
    const commentsReactionsRes = commentParams.length > 0 ? await postgresQuery(`SELECT * FROM reactions WHERE comment_id IN (${commentParams});`) : {rows: []};

    const reactions = uniq([
        ...postsReactionsRes.rows,
        ...commentsReactionsRes.rows,
    ]);

    return reactions ? reactions.map(reaction => reactionToResDto(reaction)) : [];
}

export const findUsers = async (posts = [], comments = [], reactions = []) => {
    const postUserIds = posts.map(post => post.user_id || post.userId);
    const commentsUserIds = comments.map(comment => comment.user_id || comment.userId);
    const reactionsUserIds = reactions.map(reaction => reaction.user_id || reaction.userId);

    const userIds = uniq([
        ...postUserIds,
        ...commentsUserIds,
        ...reactionsUserIds,
    ]).toString();

    const userResults = await postgresQuery(`SELECT * FROM users WHERE id IN (${userIds});`);
    return userResults ? userResults.rows : [];
}

export const mapComments = (commentResults = [], users = [], reactions = []) => {
    const comments = commentResults
        .map(com => commentToResDto(com))
        .map(com => ({
            ...com,
            user: users.find(user => user.id === com.userId),
            reactions: reactions.filter(reaction => reaction.commentId === com.id),
        }));
    return mapReplies(comments);
}

export const mapReplies = (comments = []) => {
    const allSingleComments = comments.filter(com => !com.isReply);
    const allReplies = comments.filter(com => com.isReply);
    allSingleComments.forEach(sc => {
        const foundReplies = allReplies.filter(r => r.replyCommentId === sc.id);
        sc.replies = foundReplies;
    });

    return allSingleComments;
}

export const mapPosts = async (postResults = [], users = [], comments = [], reactions = []) => {
    return postResults ? await Promise.all(
    postResults
    .map(post => postToResDto(post))
    .map(async post => {
        const postComments = comments.filter(comment => comment.postId === post.id);
        const postReactions = reactions.filter(reaction => reaction.postId === post.id && reaction.commentId == null); // reactions with this post id and is for post only

        return {
            ...post,
            user: users.find(user => user.id === post.userId),
            comments: postComments,
            reactions: postReactions, 
            reactionsNumber: calculateReactions(postReactions),
            commentsNumber: await calculateComments(post.id, postComments),
        }
    })) : []
}

export const calculateReactions = reactions => {
    const numberOfLikes = reactions.filter(reaction => reaction.reactionType === ReactionType.LIKE).length;
    const numberOfLoves = reactions.filter(reaction => reaction.reactionType === ReactionType.LOVE).length;
    const numberOfLaughs = reactions.filter(reaction => reaction.reactionType === ReactionType.LAUGH).length;
    const numberOfWows = reactions.filter(reaction => reaction.reactionType === ReactionType.WOW).length;
    const numberOfCries = reactions.filter(reaction => reaction.reactionType === ReactionType.CRY).length;

    return {
        total: reactions.length,
        1: numberOfLikes, //like
        2: numberOfLoves, // love
        3: numberOfLaughs, // laugh
        4: numberOfWows, // wow
        5: numberOfCries, // cry
    }
}

export const calculateComments = async (postId, comments) => {
    let commentNumber = 0;

    if (comments && comments.length > 0) {
        commentNumber = comments.length;
        comments.forEach(comment => {
            if (comment.replies) {
                commentNumber += comment.replies.length;
            }
        });
    } else if (postId) {
        const commentsCountResult = await postgresQuery(selectCountOfPostCommentsSQL, [postId]);
        commentNumber = parseInt(commentsCountResult.rows[0].count, 10);
    }

    return commentNumber;
}

export const findDeepComment = (comments, id) => {
    let comment = null;
    comments.forEach(com => {
        if (com.id === id) {
            comment = com;
            return;
        } 
        
        if (com.replies && com.replies.length > 0) {
            const foundComment = com.replies.find(c => c.id === id);
            if (foundComment) {
                comment = foundComment;
                return;
            }
        }
    });
    return comment;
}