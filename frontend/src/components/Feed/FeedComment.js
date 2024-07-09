import React, { useEffect, useState } from "react";
import Comment from "../Post/Comments/Comment";
import { connect } from "react-redux";
import { selectApiState } from "../../redux/reducers/apiReducer";
import { areSameObejcts, findCommentInCommentList } from "../../common/utils";

const FeedComment = props => {
    const [commentData, setCommentData] = useState(null);
    const { post, comment, commentsList, openCommentsModal } = props;

    useEffect(() => {
        if (!commentData && props.commentsList) {
            setCommentData(
                findCommentInCommentList(comment, props.commentsList)
            );
        }
    }, [props, comment, commentData]);

    useEffect(() => {
        const reduxComment = findCommentInCommentList(commentData, commentsList)
        if (commentData && !areSameObejcts(commentData, reduxComment)) {
            if (!reduxComment) {
                setCommentData(null);
            }
        }
    }, [commentsList, commentData])

    if (!comment) {
        return <React.Fragment/>
    }

    return (
        <React.Fragment>
            <Comment post={post} comment={commentData} openCommentsModal={openCommentsModal}/>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    commentsList: selectApiState(state, 'COMMENTS_LIST'),
})

export default connect(
    mapStateToProps
)(FeedComment)