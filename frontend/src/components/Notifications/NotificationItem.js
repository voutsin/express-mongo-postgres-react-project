import React, { useState } from "react";
import { ClassNames } from "../../styles/classes";
import UserImage from "../../structure/User/UserImage";
import UserName from "../../structure/User/UserName";
import { useNavigate } from "react-router-dom";
import { buildUrl } from "../../common/utils";
import { ROUTES } from "../../config/routes";
import Modal from "../../structure/Modal";
import AllFriends from "../Profile/Friends/AllFriends";

const NotificationItem = props => {
    const [friendsModalFlag, openFriendsModal] = useState(false);

    const { notification } = props;
    const navigate = useNavigate();

    if (!notification) {
        return <React.Fragment/>;
    }

    const {
        type,
        user,
        postId,
        targetId,
    } = notification;

    const handleClickItem = (e) => {
        e.preventDefault();

        if (type === 1 || type === 2) {
            openFriendsModal(true);
        } else if (postId) {
            navigate(buildUrl(ROUTES.POST.path, { id: postId }))
        }
    }

    const friendsModal = (
        <Modal
            handleClose={() => openFriendsModal(false)}
            flag={friendsModalFlag}
        >
            <AllFriends
                userId={targetId}
            />
        </Modal>
    )

    const headerText = () => {
        let message = ' ';
        switch(type) {
            case 1: // ACCEPT_FRIEND_REQUEST
                message += 'accepted your friend request.';
                break;
            case 2: // SEND_FRIEND_REQUEST
                message += 'send you a friend request';
                break;
            case 3: // REACTION_TO_POST
                message += 'reacted to your post.';
                break;
            case 4: // REACTION_TO_COMMENT
                message += 'reacted to your comment.';
                break;
            case 5: // COMMENT_TO_POST
                message += 'commented to a post.';
                break;
            case 6: // REPLY_TO_COMMENT
                message += 'replied to your comment.';
                break;
            default:
                break;
        }
        
        return (
            <React.Fragment>
                <UserName name={user.name} id={user.id} blockLink={true}/>
                {message}
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
                    {headerText()}
                </span>
            </div>
            {friendsModalFlag && friendsModal}
        </React.Fragment>
    )
}

export default NotificationItem;