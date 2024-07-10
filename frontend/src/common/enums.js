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