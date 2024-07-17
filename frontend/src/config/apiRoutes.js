import { ApiTypes } from "../common/enums";

const ApiRoutesNames = {
    REGISTER_USER: 'REGISTER_USER',
    FIND_USER_FRIENDS: 'FIND_USER_FRIENDS',
    FIND_DETAILED_USER_FRIENDS: 'FIND_DETAILED_USER_FRIENDS',
    FIND_USER_FRIENDS_BIRTHDAYS: 'FIND_USER_FRIENDS_BIRTHDAYS',
    FIND_USER_BY_ID: 'FIND_USER_BY_ID',
    FIND_USER_MEDIA: 'FIND_USER_MEDIA',
    GET_FEED: 'GET_FEED',
    VIEW_POST_REACTIONS: 'VIEW_POST_REACTIONS',
    VIEW_COMMENT_REACTIONS: 'VIEW_COMMENT_REACTIONS',
    ACCEPT_FRIENDSHIP: 'ACCEPT_FRIENDSHIP',
    REQUEST_FRIENDSHIP: 'REQUEST_FRIENDSHIP',
    DELETE_FRIENDSHIP: 'DELETE_FRIENDSHIP',
    BLOCK_FRIEND: 'BLOCK_FRIEND',
    ADD_NEW_COMMENT: 'ADD_NEW_COMMENT',
    UPDATE_COMMENT: 'UPDATE_COMMENT',
    DELETE_COMMENT: 'DELETE_COMMENT',
    VIEW_POST_COMMENTS: 'VIEW_POST_COMMENTS',
    VIEW_COMMENT_REPLIES: 'VIEW_COMMENT_REPLIES',
    REPLY: 'REPLY',
    ADD_NEW_REACTION: 'ADD_NEW_REACTION',
    UPDATE_REACTION: 'UPDATE_REACTION',
    DELETE_REACTION: 'DELETE_REACTION',
    ADD_NEW_POST: 'ADD_NEW_POST',
    UPDATE_POST: 'UPDATE_POST',
    DELETE_POST: 'DELETE_POST',
    FIND_USER_POSTS: 'FIND_USER_POSTS',
    FIND_ALL_USER_GROUPS: 'FIND_ALL_USER_GROUPS',
}

const AUTH = '/auth';
const UPLOADS = '/uploads';
const USERS = '/users';
const FRIENDS = '/friends';
const MESSAGES = '/messages';
const POSTS = '/posts';
const FEED = '/feed';
const COMMENTS = '/comments';
const REACTIONS = '/reactions';
const SEARCH = '/search';

export const BASE_URL =`http://localhost:8080`;

export const AUTH_ROUTES = {
    LOGIN: {
        route: `${AUTH}/login`,
        type: ApiTypes.POST,
    },
    REFRESH: {
        route: `${AUTH}/refresh`,
        type: ApiTypes.POST,
    },
    LOGOUT: {
        route: `${AUTH}/logout`,
        type: ApiTypes.POST,
    },
    REGISTER_USER: {
        route: `${AUTH}/register`,
        type: ApiTypes.POST,
        name: ApiRoutesNames.REGISTER_USER
    },
    VERIFY: {
        route: `${AUTH}/verify`,
        type: ApiTypes.GET,
    },
}

export const UPLOAD_ROUTES = {
    UPLOAD: {
        route: `${UPLOADS}`,
        type: ApiTypes.GET,
    },
}

export const USERS_ROUTES = {
    SEARCH_ACTIVE: {
        route: `${USERS}/search/:text`,
        type: ApiTypes.GET,
    },
    FIND_BY_ID: {
        route: `${USERS}/:id`,
        type: ApiTypes.GET,
        name: ApiRoutesNames.FIND_USER_BY_ID
    },
    FIND_USER_MEDIA: {
        route: `${USERS}/media/:id`,
        type: ApiTypes.GET,
        name: ApiRoutesNames.FIND_USER_MEDIA
    },
    EDIT: {
        route: `${USERS}/edit`,
        type: ApiTypes.PUT,
    },
    EDIT_PROF_PIC: {
        route: `${USERS}/edit/profilePic`,
        type: ApiTypes.PUT,
    },
    DEACTIVATE: {
        route: `${USERS}/deactivate`,
        type: ApiTypes.PUT,
    },
}

export const FRIENDS_ROUTES = {
    FIND_USER_FRIENDS: {
        route: `${FRIENDS}/:id`,
        type: ApiTypes.GET,
        name: ApiRoutesNames.FIND_USER_FRIENDS
    },
    FIND_DETAILED_USER_FRIENDS: {
        route: `${FRIENDS}/detailed/:id`,
        type: ApiTypes.GET,
        name: ApiRoutesNames.FIND_DETAILED_USER_FRIENDS
    },
    FIND_USER_FRIENDS_BIRTHDAYS: {
        route: `${FRIENDS}/birthdays/get`,
        type: ApiTypes.GET,
        name: ApiRoutesNames.FIND_USER_FRIENDS_BIRTHDAYS
    },
    REQUEST_FRIENDSHIP: {
        route: `${FRIENDS}/request`,
        type: ApiTypes.POST,
        name: ApiRoutesNames.REQUEST_FRIENDSHIP
    },
    ACCEPT_FRIENDSHIP: {
        route: `${FRIENDS}/accept/:friendId`,
        type: ApiTypes.PUT,
        name: ApiRoutesNames.ACCEPT_FRIENDSHIP
    },
    DELETE_FRIENDSHIP: {
        route: `${FRIENDS}/delete/:friendId`,
        type: ApiTypes.DELETE,
        name: ApiRoutesNames.DELETE_FRIENDSHIP
    },
    BLOCK_FRIEND: {
        route: `${FRIENDS}/block/:friendId`,
        type: ApiTypes.PUT,
        name: ApiRoutesNames.BLOCK_FRIEND
    },
}

export const POSTS_ROUTES = {
    FIND_BY_ID: {
        route: `${POSTS}/single/:id`,
        type: ApiTypes.GET,
    },
    FIND_USER_POSTS: {
        route: `${POSTS}/user`,
        type: ApiTypes.GET,
        name: ApiRoutesNames.FIND_USER_POSTS
    },
    ADD_NEW_POST: {
        route: `${POSTS}/addNew`,
        type: ApiTypes.POST,
        name: ApiRoutesNames.ADD_NEW_POST
    },
    UPDATE_POST: {
        route: `${POSTS}/edit`,
        type: ApiTypes.PUT,
        name: ApiRoutesNames.UPDATE_POST
    },
    DELETE_POST: {
        route: `${POSTS}/:id`,
        type: ApiTypes.DELETE,
        name: ApiRoutesNames.DELETE_POST
    },
}

export const FEED_ROUTES = {
    GET_FEED: {
        route: `${FEED}/user`,
        type: ApiTypes.GET,
        name: ApiRoutesNames.GET_FEED
    },
}

export const COMMENTS_ROUTES = {
    VIEW_COMMENT_DETAILS: {
        route: `${COMMENTS}/:id`,
        type: ApiTypes.GET,
    },
    REPLY: {
        route: `${COMMENTS}/reply/addNew`,
        type: ApiTypes.POST,
        name: ApiRoutesNames.REPLY
    },
    ADD_NEW_COMMENT: {
        route: `${COMMENTS}/addNew`,
        type: ApiTypes.POST,
        name: ApiRoutesNames.ADD_NEW_COMMENT
    },
    UPDATE_COMMENT: {
        route: `${COMMENTS}/edit`,
        type: ApiTypes.PUT,
        name: ApiRoutesNames.UPDATE_COMMENT
    },
    DELETE_COMMENT: {
        route: `${COMMENTS}/:id`,
        type: ApiTypes.DELETE,
        name: ApiRoutesNames.DELETE_COMMENT
    },
    VIEW_POST_COMMENTS: {
        route: `${COMMENTS}/post`,
        type: ApiTypes.GET,
        name: ApiRoutesNames.VIEW_POST_COMMENTS
    },
    VIEW_COMMENT_REPLIES: {
        route: `${COMMENTS}/replies`,
        type: ApiTypes.GET,
        name: ApiRoutesNames.VIEW_COMMENT_REPLIES
    },
}

export const REACTIONS_ROUTES = {
    VIEW_REACTION_DETAILS: {
        route: `${REACTIONS}/:id`,
        type: ApiTypes.GET,
    },
    VIEW_POST_REACTIONS: {
        route: `${REACTIONS}/post/:id`,
        type: ApiTypes.GET,
        name: ApiRoutesNames.VIEW_POST_REACTIONS
    },
    VIEW_COMMENT_REACTIONS: {
        route: `${REACTIONS}/comment/:id`,
        type: ApiTypes.GET,
        name: ApiRoutesNames.VIEW_COMMENT_REACTIONS
    },
    ADD_NEW_REACTION: {
        route: `${REACTIONS}/addNew`,
        type: ApiTypes.POST,
        name: ApiRoutesNames.ADD_NEW_REACTION
    },
    UPDATE_REACTION: {
        route: `${REACTIONS}/edit`,
        type: ApiTypes.PUT,
        name: ApiRoutesNames.UPDATE_REACTION
    },
    DELETE_REACTION: {
        route: `${REACTIONS}/:id`,
        type: ApiTypes.DELETE,
        name: ApiRoutesNames.DELETE_REACTION
    },
}

export const SEARCH_ROUTES = {
    SEARCH_BY_CRITERIA: {
        route: `${SEARCH}/criteria`,
        type: ApiTypes.GET,
    },
}

export const MESSAGE_ROUTES = {
    FIND_ALL_USER_GROUPS: {
        route: `${MESSAGES}/groups`,
        type: ApiTypes.GET,
        name: ApiRoutesNames.FIND_ALL_USER_GROUPS
    },
}
