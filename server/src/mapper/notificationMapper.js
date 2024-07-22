
export const notificationToResDto = notification => ({
    userId: notification.userId,
    type: notification.type,
    postId: notification.postId,
    commentId: notification.commentId,
    targetId: notification.targetId,
    id: notification._id,
    timestamp: notification.timestamp,
});