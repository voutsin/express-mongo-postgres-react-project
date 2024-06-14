import { pick } from "underscore";
import { postgresQuery } from "../db/postgres.js";
import { findPostDetailsSQL } from "../db/queries/postsQueries.js";
import { findDetailedLists } from "./utils.js";

export const postToResDto = post => {
    return {
        id: post.id,
        userId: post.user_id,
        content: post.content,
        mediaUrl: post.media_url,
        createdAt: post.created_at,
        postType: post.post_type,
    }
}

// for feed or view
export const detailedPostToResDto = async post => {
    const lists = await findDetailedLists(post.id);
    const {
        posts
    } = lists;

    return posts.find(p => p.id === post.id) || null;
}

export const postToResDtoForSearch = async post => {
    const postResults = await postgresQuery(findPostDetailsSQL, [post.id]);
    const postInfo = postResults.rows[0];

    const postFields = [
        'postid',
        'postuserid',
        'postcontent',
        'postmediaurl',
        'postcreatedat',
        'posttype'
    ]
    const postPickedFields = pick(postInfo, postFields)
    const userFields = [
        'userid',
        'username',
        'useremail',
        'usercreatedat',
        'userprofpicurl',
        'userdisplayname',
        'userdesc',
        'useractive'
    ]
    const userPickedFields = pick(postInfo, userFields)

    return {
        post: {
            id: postPickedFields.postid,
            userId: postPickedFields.postuserid,
            content: postPickedFields.postcontent,
            mediaUrl: postPickedFields.postmediaurl,
            createdAt: postPickedFields.postcreatedat,
            postType: postPickedFields.posttype,
        },
        user: {
            id: userPickedFields.userid,
            username: userPickedFields.username,
            email: userPickedFields.useremail,
            createAt: userPickedFields.usercreatedat,
            profilePictureUrl: userPickedFields.userprofpicurl,
            name: userPickedFields.userdisplayname,
            description: userPickedFields.userdesc,
            active: Boolean(userPickedFields.useractive),
        },
        commentCount: parseInt(postInfo.commentcount),
        reactionCount: parseInt(postInfo.reactioncount)
    };
}

export const postReqDtoToPost = req => {
    return {
        user_id: req.userId,
        content: req.content,
        media_url: req.mediaUrl,
        post_type: parseInt(req.postType),
    }
}

export const updatePostReqDtoToPost = req => {
    return {
        id: parseInt(req.id),
        content: req.content,
        media_url: req.mediaUrl,
        post_type: parseInt(req.postType),
    }
}