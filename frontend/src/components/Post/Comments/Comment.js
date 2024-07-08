import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { selectApiState } from "../../../redux/reducers/apiReducer";
import { clearCommentData } from "../../../redux/actions/actions";
import CommentBody from "./CommentBody";
import { areSameObejcts, findCommentInCommentList } from "../../../common/utils";

const Comment = props => {
    const [commentData, setCommentData] = useState(null);
    const { post, comment, commentsList, clearCommentData } = props;

    // when have comment from props update commentData
    useEffect(() => {
        if (comment && !commentData) {
            setCommentData(comment);
        }
    }, [comment, commentData]);

    useEffect(() => {
        const reduxComment = findCommentInCommentList(commentData, commentsList)
        if (commentData && !areSameObejcts(commentData, reduxComment) && reduxComment) {
            const foundComment = reduxComment.id === commentData.id;
            if (foundComment) {
                setCommentData(reduxComment);
                clearCommentData();
            }
        }
    }, [commentsList, commentData, clearCommentData])

    if (!comment || !commentData) {
        return <React.Fragment/>;
    }

    return (
        <React.Fragment>
            <CommentBody post={post} comment={commentData} />
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    commentsList: selectApiState(state, 'COMMENTS_LIST'),
});
const mapDispatchToProps = dispatch => ({
    clearCommentData: () => dispatch(clearCommentData()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Comment);