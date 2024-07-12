import { NotifyTypes } from "../../common/enums";
import { getDeepProp, getReplyParentComment, groupedComments, isObjectEmpty } from "../../common/utils";
import { COMMENTS_ROUTES, FEED_ROUTES } from "../../config/apiRoutes";
import ActionTypes from "../actions/actionTypes";


const defaultState = {};

export const apiReducer = (state = defaultState, action) => {
    let updatedState = { ...state };

    switch(action.type) {
        case ActionTypes.CLEAR_DATA:
            const stateValues = action.payload;
            if (stateValues == null) {
                return defaultState;
            }
            updatedState = Object.assign({}, state);
            Object.keys(updatedState).forEach(key => {
                if (stateValues.includes(key)) {
                    updatedState[key] = null;
                }
            })
            return updatedState;
        case ActionTypes.SET_ERROR:
            const { error } = action.payload;
            if (!error || isObjectEmpty(error)) {
                return {...state}
            }
            const errors = error.response.data.errors || error.response.data.error;
            const errorMessage = Array.isArray(errors) ? errors.map(err => err.msg).join(', <br/>') : errors;
            return {
                ...state,
                error: error.response,
                notify: {
                    type: NotifyTypes.ERROR,
                    message: errorMessage,
                },
            }
        case ActionTypes.NOTIFY:
            return {
                ...state,
                notify: action.payload,
            }
        case ActionTypes.CLEAR_NOTIFY:
            return {
                ...state,
                notify: null,
            }
        case ActionTypes.SET_API_DATA:
            const {apiRouteName, apiSuccess, data} = action.payload;
            if (apiSuccess) {
                return {
                    ...state,
                    [apiRouteName]: {
                        data: data,
                        success: apiSuccess,
                    },
                }
            } else {
                return {...state};
            }

        // SET FEED DATA
        case ActionTypes.SET_FEED_DATA:
            const newFeeds = action.payload.feeds;
            const feedObj = updatedState[FEED_ROUTES.GET_FEED.name];
            const feedPostIds = newFeeds.map(f => f.post && f.post.id).filter(id => id != null);

            let updatedFeeds = [];
            if (feedObj && feedObj.data && feedObj.data.feeds && feedObj.data.feeds.length >  0) {
                updatedFeeds = feedObj.data.feeds.filter(f => f.post && !feedPostIds.includes(f.post.id)); // filter existing posts
                updatedFeeds.push(...newFeeds);
            } else {
                updatedFeeds = [...newFeeds];
            }

            const {
                page, pageSize, totalPages, totalRecords
            } = action.payload;

            return {
                ...updatedState,
                [FEED_ROUTES.GET_FEED.name]: feedObj && feedObj.data
                    ? {
                        ...feedObj,
                        data: {
                            ...feedObj.data,
                            page, pageSize, totalPages, totalRecords,
                            feeds: updatedFeeds
                        }
                    }
                    : {
                        data: action.payload,
                        success: true,
                    },
            }

        case ActionTypes.SET_FEED_POST_DATA:
            // get feeds
            const feeds = getDeepProp(updatedState, `${[FEED_ROUTES.GET_FEED.name]}.data.feeds`) || [];
            // get posts and comments
            const feedPosts = feeds.map(feed => feed.post);
            const comments = feeds.map(feed => feed.topFeed)
                .filter(tf => tf.comment != null)
                .map(tf => getReplyParentComment(tf.comment));
                
            return {
                ...state,
                POSTS_LIST: feedPosts,
                COMMENTS_LIST: groupedComments(comments),
            }

        case ActionTypes.REFRESH_POST_DATA:
            // refresh post data after post reaction
            const updatedPost = action.payload;

            return {
                ...updatedState,
                POSTS_LIST: updatedState.POSTS_LIST 
                    ? updatedState.POSTS_LIST.map(p => {
                        return p.id === updatedPost.id  
                            ? updatedPost
                            : p
                    })
                    : [updatedPost],
            }

        // ADD NEW POST 
        case ActionTypes.ADD_NEW_POST_DATA:
            const newPost = action.payload.post;

            return {
                ...updatedState,
                POSTS_LIST: [
                    newPost,
                    ...updatedState.POSTS_LIST
                ],
            }

        // DELETE POST 
        case ActionTypes.DELETE_POST_DATA:
            const deletedPost = action.payload;
            return {
                ...updatedState,
                [FEED_ROUTES.GET_FEED.name]: updatedState[FEED_ROUTES.GET_FEED.name] && updatedState[FEED_ROUTES.GET_FEED.name].data
                    ? {
                        ...updatedState[FEED_ROUTES.GET_FEED.name],
                        data: {
                            ...updatedState[FEED_ROUTES.GET_FEED.name].data,
                            feeds: updatedState[FEED_ROUTES.GET_FEED.name].data.feeds.filter(feed => feed.post && feed.post.id !== deletedPost.id)
                        }
                    }
                    : null,
                POSTS_LIST: updatedState.POSTS_LIST 
                    ? updatedState.POSTS_LIST.filter(post => post.id !== deletedPost.id)
                    : [],
            }

        // UPDATE POST 
        case ActionTypes.UPDATE_POST_DATA:
            const post = action.payload;

            const fidAndUpdatePost = posts => {
                return posts.map(p => {
                    if (p.id === post.id) {
                        return {
                            ...p,
                            ...post,
                        }
                    }
                    return p;
                })
            }

            return {
                ...updatedState,
                [FEED_ROUTES.GET_FEED.name]: updatedState[FEED_ROUTES.GET_FEED.name] && updatedState[FEED_ROUTES.GET_FEED.name].data
                    ? {
                        ...updatedState[FEED_ROUTES.GET_FEED.name],
                        data: {
                            ...updatedState[FEED_ROUTES.GET_FEED.name].data,
                            feeds: updatedState[FEED_ROUTES.GET_FEED.name].data.feeds.map(feed => {
                                if (feed.post && feed.post.id === post.id) {
                                    return {
                                        ...feed,
                                        post: {
                                            ...feed.post,
                                            ...post,
                                        }
                                    }
                                }
                                return feed;
                            })
                        }
                    }
                    : null,
                POSTS_LIST: updatedState.POSTS_LIST 
                    ? fidAndUpdatePost(updatedState.POSTS_LIST)
                    : [],
            }

        case ActionTypes.SET_COMMENTS_LIST:
            const commentsList = action.payload.comments;
            const commentIds = commentsList.map(c => c.id);
            return {
                ...updatedState,
                COMMENTS_LIST: {
                    ...updatedState.COMMENTS_LIST,
                    [action.payload.postId]: [
                        ...updatedState.COMMENTS_LIST[action.payload.postId].filter(c => !commentIds.includes(c.id)),
                        ...commentsList
                    ]
                },
            }

        case ActionTypes.RESET_COMMENTS_LIST:
            const feedState = updatedState[FEED_ROUTES.GET_FEED.name] && updatedState[FEED_ROUTES.GET_FEED.name].data;
            if (feedState) {
                const comments = feedState.feeds.map(feed => feed.topFeed)
                .filter(tf => tf.comment != null)
                .map(tf => getReplyParentComment(tf.comment));
                return {
                    ...updatedState,
                    COMMENTS_LIST: groupedComments(comments),
                }
            }
            
            return {
                ...updatedState,
                COMMENTS_LIST: [],
            }
        
        case ActionTypes.SET_NEW_COMMENT_DATA: 
            // add new single comment
            const newComment = action.payload;
            return {
                ...state,
                COMMENTS_LIST: {
                    ...state.COMMENTS_LIST,
                    [newComment.postId]: [
                        ...state.COMMENTS_LIST[newComment.postId],
                        newComment,
                    ]
                },
            }

        // FOR DELETE/UPDATE PARENT COMMENT
        case ActionTypes.UPDATE_COMMENT_DATA:
            const comment = action.payload.comment;

            const deleteOrUpdateComment = (comments) => {
                return action.payload.deleteFlag 
                    ? comments.filter(c => c.id !== comment.id)
                    : comments.map(c => {
                        return c.id === comment.id ? {
                            ...c,
                            ...comment
                        } : c;
                    });
            }

            return {
                ...updatedState,
                COMMENTS_LIST: {
                    ...updatedState.COMMENTS_LIST,
                    [comment.postId]: deleteOrUpdateComment(updatedState.COMMENTS_LIST[comment.postId])
                },
            }

        // FOR ADD NEW REPLY
        case ActionTypes.SET_NEW_REPLY_DATA:
            const newReply = action.payload;

            const addNewReply = comments => {
                return comments.map(c => {
                    if (c.id === newReply.replyCommentId) {
                        const reply = Object.assign({}, newReply);
                        delete reply.replyComment;
                        return {
                            ...c,
                            replies: c.replies ? [
                                ...c.replies,
                                reply,
                            ] : [reply]
                        }
                    }
                    return c;
                });
            }
            
            return {
                ...updatedState,
                COMMENTS_LIST: {
                    ...updatedState.COMMENTS_LIST,
                    [newReply.postId]: addNewReply(updatedState.COMMENTS_LIST[newReply.postId]),
                },
            }

        // FOR ADD MULTIPLE NEW REPLIES
        case ActionTypes.SET_COMMENTS_REPLIES_LIST:
            const newReplies = action.payload.replies;
            const commentId = action.payload.commentId;
            const postId = action.payload.postId;

            const addNewReplies = comments => {
                return comments.map(c => {
                    if (c.id === commentId) {
                        const replies = newReplies.map(r => {
                            delete r.replyComment; 
                            return r;
                        });
                        const repliesIds = replies.map(r => r.id);

                        return {
                            ...c,
                            replies: c.replies ? [
                                ...c.replies.filter(r => !repliesIds.includes(r.id)),
                                ...replies,
                            ] : [...replies]
                        }
                    }
                    return c;
                });
            }
            
            return {
                ...updatedState,
                COMMENTS_LIST: {
                    ...updatedState.COMMENTS_LIST,
                    [postId]: addNewReplies(updatedState.COMMENTS_LIST[postId]),
                },
            }

        // FOR UPDATE/DELETE REPLY
        case ActionTypes.UPDATE_REPLY_DATA:
            const replyComment = action.payload.replyComment;

            const updateOrDeleteReply = comments => {
                return comments.map(parent => {
                    return parent.id === replyComment.replyCommentId 
                    ? {
                        ...parent,
                        replies: parent.replies 
                            ? action.payload.deleteFlag
                                ? parent.replies.filter(r => r.id !== replyComment.id) // delete reply
                                : parent.replies.map(r => {
                                    return r.id === replyComment.id ? {
                                        ...r,
                                        ...replyComment,
                                    } : r // find and replace
                                })
                            : [],
                    } : parent
                });
            }

            return {
                ...updatedState,
                COMMENTS_LIST: {
                    ...updatedState.COMMENTS_LIST,
                    [replyComment.postId]: updateOrDeleteReply(updatedState.COMMENTS_LIST[replyComment.postId]),
                },
            }

        case ActionTypes.CLEAR_COMMENT_DATA:
            return {
                ...state,
                [COMMENTS_ROUTES.ADD_NEW_COMMENT.name]: null,
                [COMMENTS_ROUTES.UPDATE_COMMENT.name]: null,
                [COMMENTS_ROUTES.DELETE_COMMENT.name]: null,
            }

        default:
            return state;
    }
}

//SELECTORS
export const selectApiState = (state, valueName) => (state.api && state.api[valueName]);
export const selectPostsData = state => (state.api && state.api.POSTS_LIST);
export const selectCommentsData = state => (state.api && state.api.COMMENTS_LIST) || [];
export const selectFeedData = state => (state.api && state.api[FEED_ROUTES.GET_FEED.name] && state.api[FEED_ROUTES.GET_FEED.name].data) || [];

export const selectTopFeeds = state => {
    if (state.api[FEED_ROUTES.GET_FEED.name] && state.api[FEED_ROUTES.GET_FEED.name].data) {
        return state.api[FEED_ROUTES.GET_FEED.name].data.feeds.map(f => f.topFeed);
    }

    return [];
}