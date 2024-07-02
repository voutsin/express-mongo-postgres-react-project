import React from "react";
import { ClassNames } from "../../../styles/classes";
import AddComment from "./AddComment";

const CommentsSection = props => {

    const { post, commentRef, inputFocus } = props;

    return (
        <React.Fragment>
            {post && post.comments && post.comments.length > 0 && 
                <div className={ClassNames.COMMENTS_WRAPPER}>
                    <div className={ClassNames.COMMENTS_LIST}>

                    </div>
                </div>
            }
            <AddComment post={post} commentRef={commentRef} inputFocus={inputFocus} />
        </React.Fragment>
    )
}

export default CommentsSection;