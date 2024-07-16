import React, { useState } from "react";
import { ClassNames } from "../../../styles/classes";
import UserName from "../../../structure/User/UserName";
import { getDeepProp } from "../../../common/utils";
import UserImage from "../../../structure/User/UserImage";
import Modal from "../../../structure/Modal";
import ReactionsList from "./ReactionsList";

const ReactionsSection = props => {
    const [userModalFlag, openUsersModal] = useState(false);

    const {
        reactionList,
        reactionsNumber,
        commentsNumber,
        openCommentsModal,
    } = props;

    const firstReaction = getDeepProp(props, 'reactionList.0');
    const user = getDeepProp(props, 'reactionList.0.user');

    const getText = () => {
        const otherCount = reactionList.length - 1;

        let string = '';
        if (otherCount > 0) {
            string = <React.Fragment> and <span onClick={() => openUsersModal(true)}>{otherCount} other</span>.</React.Fragment>
        } else {
            string += `${firstReaction && firstReaction.reactionType === 1 ? ' liked' : ' reacted'}`;
        }

        return user && (
            <React.Fragment>
                <UserName name={user.name} id={user.id}/>
                {string}
            </React.Fragment>
        )
    }

    const userModal = (
        <Modal
            handleClose={() => openUsersModal(false)}
            flag={userModalFlag}
        >
            <ReactionsList 
                postId={firstReaction ? firstReaction.postId : null} 
                reactionsNumber={reactionsNumber}
            />
        </Modal>
    )

    return (reactionList && reactionList.length > 0) || commentsNumber ? (
        <React.Fragment>
            <div className={ClassNames.REACTIONS_SECTION}>
                <div className="reactions">
                    {user && <UserImage
                        id={user.id}
                        picUrl={user.profilePictureThumb}
                        username={user.username}
                        className={ClassNames.THUMBNAIL_IMG}
                    />}
                    <span className="text">
                        {getText()}
                    </span>
                </div>
                <div className="commentsCount">
                    <span onClick={openCommentsModal}>
                        {commentsNumber ? `${commentsNumber} comments` : ''}
                    </span>
                </div>
            </div>
            {userModalFlag && userModal}
        </React.Fragment>
    ) :  null
}

export default ReactionsSection;
