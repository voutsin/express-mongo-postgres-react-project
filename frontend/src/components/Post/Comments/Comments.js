import React from "react";
import { ClassNames } from "../../../styles/classes";
import Comment from "./Comment";
import CommentForm from "./CommentForm";

const CommentsSection = props => {

    const { post, commentRef, inputFocus } = props;

    return (
        <React.Fragment>
            {post && post.comments && post.comments.length > 0 && 
                <div className={ClassNames.COMMENTS_WRAPPER}>
                    <div className={ClassNames.COMMENTS_LIST}>
                        {post.comments.map(comment => {
                            return (
                                <Comment post={post} comment={comment}/>
                            )
                        })}
                    </div>
                </div>
            }
            <CommentForm post={post} commentRef={commentRef} inputFocus={inputFocus} />
        </React.Fragment>
    )
}

export default CommentsSection;