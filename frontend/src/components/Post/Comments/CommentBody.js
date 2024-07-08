import React, { useEffect, useRef, useState } from "react";
import { ClassNames } from "../../../styles/classes";
import CommentForm from "./CommentForm";
import CommentStructure from "./CommentStructure";

const CommentBody = props => {
    const commentRef = useRef(null);
    const [replyFlag, openReplyFlag] = useState(false);
    const [updatedComment, setUpdateComment] = useState(null);
    const [commentData, setCommentData] = useState(null);
    
    const { post, comment, isReply } = props;

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

    return (
        <React.Fragment>
            <div className={ClassNames.COMMENT_WRAPPER}>
                <CommentStructure
                    comment={commentData} 
                    post={post} 
                    handleToggleCommentReply={handleToggleCommentReply} 
                    handleUpdateComment={handleUpdateComment}
                />
                <div className={ClassNames.REPLIES_WRAPPER}>
                    {commentData.replies && commentData.replies.length > 0 
                        && commentData.replies.map((reply, index) => {
                            return (
                                <CommentStructure
                                    key={comment.id + index}
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