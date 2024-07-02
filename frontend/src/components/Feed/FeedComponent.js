import React from "react";
import { ClassNames } from "../../styles/classes";
import Post from "../Post/Post";
import { FeedType } from "../../common/enums";
import UserName from "../../structure/User/UserName";
import UserImage from "../../structure/User/UserImage";

const FeedComponent = props => {
    const { feed } = props;

    if (feed == null) {
        return <React.Fragment/>;
    }

    const {
        post, users, feeds
    } = feed;

    const user = users ? users[0] : {};
    const firstFeed = feeds ? feeds[0] : {};

    const {
        type,
        content
    } = firstFeed;

    const headerText = (user, userSize, comment, type) => {
        const otherCount = userSize - 1;
        return (
            <React.Fragment>
                <UserName name={user.name} id={user.id}/>
                {type === FeedType.COMMENT ? ' added a comment'
                : ` reacted${comment ? ' to a comment' : ''}`}
                {userSize > 1 && ` and ${otherCount} other friend${otherCount > 1 ? 's' : ''} also interacted`}
                .
            </React.Fragment>
        )
    }

    const Header = type !== FeedType.POST ? (
        <div className="header">
            <UserImage
                id={user.id}
                picUrl={user.profilePictureThumb}
                username={user.username}
                className={ClassNames.THUMBNAIL_IMG}
            />
            <span className="text">
                {headerText(user, users.length, content.comment, type)}
            </span>
        </div>
    ) : null;

    return (
        <React.Fragment>
            <div className={ClassNames.FEED_ITEM}>
                {Header}
                <Post post={post}/>
            </div>
        </React.Fragment>
    );
}

export default FeedComponent;