import React from "react";
import { ClassNames } from "../../styles/classes";
import UserImage from "../../structure/User/UserImage";
import UserName from "../../structure/User/UserName";
import { FeedType } from "../../common/enums";
import { useNavigate } from "react-router-dom";
import { buildUrl } from "../../common/utils";
import { ROUTES } from "../../config/routes";

const NotificationItem = props => {
    const { notification } = props;
    const navigate = useNavigate();

    if (!notification) {
        return <React.Fragment/>;
    }

    const {
        topFeed,
        postId
    } = notification;

    const user = topFeed ? topFeed.user : {};

    const {
        type,
        content
    } = topFeed;

    const handleClickItem = (e) => {
        e.preventDefault();
        if (postId) {
            navigate(buildUrl(ROUTES.POST.path, { id: postId }))
        }
    }

    const headerText = (user, userSize, comment, type) => {
        const otherCount = userSize - 1;
        return (
            <React.Fragment>
                <UserName name={user.name} id={user.id} blockLink={true}/>
                {type === FeedType.COMMENT ? ' added a comment to your post'
                : ` reacted${comment ? ' to your comment' : ''}`}
                {userSize > 1 && ` and ${otherCount} other friend${otherCount > 1 ? 's' : ''} also interacted`}
                .
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <div className={ClassNames.NOTIFICATION} onClick={handleClickItem}>
                <UserImage
                    id={user.id}
                    picUrl={user.profilePictureThumb}
                    username={user.username}
                    className={ClassNames.THUMBNAIL_IMG}
                    blockLink={true}
                />
                <span className="text">
                    {headerText(user, notification.users.length, content.commentId, type)}
                </span>
            </div>
        </React.Fragment>
    )
}

export default NotificationItem;