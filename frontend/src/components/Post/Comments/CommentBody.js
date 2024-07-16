import React, { useEffect, useRef, useState } from "react";
import { ClassNames } from "../../../styles/classes";
import CommentForm from "./CommentForm";
import CommentStructure from "./CommentStructure";

const CommentBody = props => {
    const commentRef = useRef(null);
    const [replyFlag, openReplyFlag] = useState(false);
    const [updatedComment, setUpdateComment] = useState(null);
    const [commentData, setCommentData] = useState(null);
    
    const { post, comment, isReply, showReplies, totalReplies, openCommentsModal } = props;

    useEffect(() => {
        setCommentData(comment);
    }, [comment])

    if (!commentData) {
        return <React.Fragment/>
    }

    const handleToggleCommentReply = () => {
        commentRef.current.classList.add(ClassNames.DISPLAY);
        // Scroll to the div
        commentRef.current.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
        openReplyFlag(true);
    }

    const handleUpdateComment = comment => setUpdateComment(comment);

    const handleOpenCommentsModal = () => {
        if (!showReplies) {
            openCommentsModal();
        } else {
            showReplies();
        }
        
    }

    const loadMoreReplies = totalReplies > 0 && commentData.replies && commentData.replies.length > 0 
    ? commentData.replies.length < totalReplies 
    : totalReplies === -1 && commentData.replies && commentData.replies.length > 0;

    return (
        <React.Fragment>
            <div className={ClassNames.COMMENT_WRAPPER}>
                {!showReplies && 
                    <div className="view-more-comments">
                        <span onClick={handleOpenCommentsModal}>View more comments</span>
                    </div>
                }
                <CommentStructure
                    comment={commentData} 
                    post={post} 
                    handleToggleCommentReply={handleToggleCommentReply} 
                    handleUpdateComment={handleUpdateComment}
                />
                <div className={ClassNames.REPLIES_WRAPPER}>
                    {showReplies && loadMoreReplies && <div className="view-more-comments">
                        <span onClick={handleOpenCommentsModal}>View more replies</span>
                    </div>}
                    {commentData.replies && commentData.replies.length > 0 
                        && commentData.replies.map((reply, index) => {
                            return (
                                <CommentStructure
                                    key={`comStr-${comment.id}${index}`}
                                    comment={reply} 
                                    post={post} 
                                    handleUpdateComment={handleUpdateComment}
                                />
                            )
                        })
                    }
                </div>
                <CommentForm 
                    post={post} 
                    commentRef={commentRef} 
                    inputFocus={replyFlag} 
                    isReply={isReply || replyFlag}
                    replyComment={replyFlag ? commentData : null}
                    updatedComment={updatedComment}
                    handleUpdateComment={handleUpdateComment}
                />
            </div>
        </React.Fragment>
    )
}

export default CommentBody;