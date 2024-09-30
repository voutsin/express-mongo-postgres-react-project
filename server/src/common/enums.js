
export const getEnumByValue = (enumValue, value) => {
    return Object.keys(enumValue).find(key => enumValue[key] === value);
}

export const FriendStatus = {
    REQUESTED: '1',
    PENDING: '2',
    ACCEPTED: '3',
    BLOCKED: '4'
}

export const PostType = {
    PROFILE_PIC: 1,
    STATUS: 2,
    MULTIMEDIA: 3,
}

export const FeedTypes = {
    POST: 1,
    COMMENT: 2,
    REACTION: 3,
}

export const ReactionType = {
    LIKE: 1,
    LOVE: 2,
    LAUGH: 3,
    WOW: 4,
    CRY: 5,
}

export const MessageStatus = {
    SENT: {
        code: 1,
        text: 'Sent'
    },
    FAILED: {
        code: 2,
        text: 'Failed'
    },
}

export const NotificationTypes = {
    ACCEPT_FRIEND_REQUEST: 1,
    SEND_FRIEND_REQUEST: 2,
    REACTION_TO_POST: 3,
    REACTION_TO_COMMENT: 4,
    COMMENT_TO_POST: 5,
    REPLY_TO_COMMENT: 6,
}