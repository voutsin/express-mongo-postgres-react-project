import axios from 'axios';
import { MdFavorite, MdOutlineSentimentDissatisfied, MdSentimentNeutral, MdSentimentVerySatisfied, MdThumbUp } from 'react-icons/md';

export const ApiTypes = {
    POST: axios.post,
    PUT: axios.put,
    GET: axios.get,
    DELETE: axios.delete,
}

export const NotifyTypes = {
    ERROR: 'error',
    WARNING: 'warning',
    SUCCESS: 'success'
}

export const FeedType = {
    POST: 1,
    COMMENT: 2,
    REACTION: 3,
}

export const ReactionMapping = {
    1: {
        icon: <MdThumbUp/>,
        name: 'Like',
        className: 'liked',
    },
    2: {
        icon: <MdFavorite/>,
        name: 'Love',
        className: 'loved',
    },
    3: {
        icon: <MdSentimentVerySatisfied/>,
        name: 'Laugh',
        className: 'laughed',
    },
    4: {
        icon: <MdSentimentNeutral/>,
        name: 'Stuned',
        className: 'stuned',
    },
    5: {
        icon: <MdOutlineSentimentDissatisfied/>,
        name: 'Sad',
        className: 'sad',
    },
}

export const FriendStatusMapping = {
    1: {
        icon: null,
        name: 'Requested',
    },
    2: {
        icon: null,
        name: 'Pending',
    },
    3: {
        icon: null,
        name: 'Accepted',
    },
    4: {
        icon: null,
        name: 'Blocked',
    },
}

export const FriendUserAction = {
    REQUEST: {
        value: 1,
        name: 'Request',
        action: 'sendFriendRequest',
    },
    CANCEL_REQUEST: {
        value: 2,
        name: 'Cancel Request',
        action: 'cancelFriendRequest',
    },
    ACCEPT: {
        value: 3,
        name: 'Accept',
        action: 'acceptFriendRequest',
    },
    DECLINE: {
        value: 4,
        name: 'Decline',
        action: 'declineFriendRequest',
    },
    UNFRIEND: {
        value: 5,
        name: 'Unfriend',
        action: 'deleteFriendship',
    },
    BLOCK: {
        value: 6,
        name: 'Block',
        action: 'blockUser',
    },
    UNBLOCK: {
        value: 7,
        name: 'UnBlock',
        action: 'unBlockUser',
    },
}

export const Reactions = {
    LIKE: 1,
    LOVE: 2,
    LAUGH: 3,
    WOW: 4,
    CRY: 5,
}

export const PostTypes = {
    PROFILE_PIC: 1,
    STATUS: 2,
    MULTIMEDIA: 3,
}