import React, { useState } from "react";
import UserImage from "../../../structure/User/UserImage";
import { ClassNames } from "../../../styles/classes";
import { Button } from "../../../structure/Form/Form";
import { MdMoreVert, MdThumbUp } from "react-icons/md";
import ReactButton from "../utils/ReactButton";
import { calculatePostAge, organizeReactions } from "../../../common/utils";
import UserName from "../../../structure/User/UserName";
import TooltipModal from "../../../structure/TooltipModal";
import OptionsModal from "../utils/OptionsModal";
import ReactionsList from "../Reactions/ReactionsList";
import Modal from "../../../structure/Modal";

const CommentStructure = props => {
    const [optionsModalFlag, openOptionsModal] = useState(false);
    const [reactionsListFlag, openReactionsList] = useState(false);

    const { 
        comment, 
        post, 
        handleToggleCommentReply,
        handleUpdateComment 
    } = props;

    if (!comment) {
        return <React.Fragment/>
    }

    const { user } = comment;

    const commentAge = calculatePostAge(comment.createdAt);

    const optionsModal = (
        <TooltipModal
            handleClose={() => openOptionsModal(false)}
            flag={optionsModalFlag}
        >
            <OptionsModal comment={comment} handleUpdateComment={handleUpdateComment}/>
        </TooltipModal>
    );

    const reactionsModal = (
        <Modal
            handleClose={() => openReactionsList(false)}
            flag={reactionsListFlag}
        >
            <ReactionsList 
                postId={null} 
                commentId={comment.id} 
                reactionsNumber={organizeReactions(comment.reactions || [])}/>
        </Modal>
    );

    return(
        <React.Fragment>
            <div className={ClassNames.COMMENT_BODY}>
                <UserImage
                    id={user.id}
                    picUrl={user.profilePictureThumb}
                    username={user.username}
                    className={ClassNames.THUMBNAIL_IMG}
                />
                <div className={ClassNames.COMMENT_CONTENT}>
                    <div className="message">
                        <UserName name={user.name} id={user.id}/>
                        <span className="text">
                            {comment.content}
                        </span>
                    </div>
                    <div className={ClassNames.COMMENT_ACTIONS}>
                        <div className="age">
                            {`${commentAge.value}${commentAge.key ? ` ${commentAge.key} ago` : ''}`}
                        </div>
                        <div className="react">
                            <ReactButton post={post} comment={comment} />
                        </div>
                        <div className="reply">
                            {comment.isReply 
                                ? null 
                                : <Button className={'btn'} onClick={handleToggleCommentReply}>
                                    <span>Reply</span>
                                </Button>
                            }
                        </div>
                        <div className="reaction-list">
                            {comment.reactions && comment.reactions.length > 0
                                && <Button className={'btn'} onClick={() => openReactionsList(true)}>
                                    <span>{comment.reactions.length}</span>
                                    <MdThumbUp/>
                                </Button>
                            }
                        </div>
                    </div>
                </div>
                <div className="actions">
                    <Button className={ClassNames.INVISIBLE_BTN} onClick={() => openOptionsModal(true)}>
                        <MdMoreVert/>
                    </Button>
                    {optionsModalFlag && optionsModal}
                </div>
                {reactionsListFlag && reactionsModal}
            </div>
        </React.Fragment>
    )
}

export default CommentStructure;