import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { selectApiState } from "../../../redux/reducers/apiReducer";
import { clearCommentData, clearData, getCommentReplies } from "../../../redux/actions/actions";
import CommentBody from "./CommentBody";
import { areSameObejcts, findCommentInCommentList } from "../../../common/utils";
import { COMMENTS_ROUTES } from "../../../config/apiRoutes";

const Comment = props => {
    const [commentData, setCommentData] = useState(null);
    const [fetchComments, setFetchComments] = useState(false);
    const [clearComments, setClearComments] = useState(false);
    const [repliesPage, setRepliesPage] = useState({ page: 0, limit: 2, totalCount: -1, totalPages: 0});

    const { post, comment, commentsList, clearCommentData, clearData, showList, getRepliesList, openCommentsModal } = props;

    const clearRepliesData = useCallback(() => {
        clearData([COMMENTS_ROUTES.VIEW_COMMENT_REPLIES.name]);
        setClearComments(prev => !prev); // false
    }, [clearData]);

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
    }, [commentsList, commentData, clearCommentData, repliesPage]);

    useEffect(() => {
        if (getRepliesList && getRepliesList.success && !fetchComments) {
            const data = { ...getRepliesList.data };
    
            setRepliesPage(prevState => ({
                ...prevState,
                page: data.currentPage,
                totalCount: data.totalCount,
                totalPages: data.totalPages
            }));
            
            setFetchComments(prev => !prev); //true
            setClearComments(prev => !prev); //true
        }
    }, [getRepliesList, fetchComments]);

    useEffect(() => {
        if (getRepliesList && getRepliesList.success && clearComments) {
            clearRepliesData();
        }
    }, [getRepliesList, clearComments, clearRepliesData])

    useEffect(() => {
        if (repliesPage.totalCount === 0 && commentData && commentData.replies && commentData.replies.length > 0) {
            setRepliesPage({
                ...repliesPage,
                totalCount: commentData.replies.length,
            });
        }
    }, [repliesPage, commentData]);

    if (!comment || !commentData) {
        return <React.Fragment/>;
    }

    const handleLoadMoreReplies = () => {
        console.log("page: ", repliesPage)
        console.log("new page: ", repliesPage.page + 1)
        props.getCommentReplies(post.id, commentData.id, repliesPage.page + 1, repliesPage.limit);
        setFetchComments(false);
    }

    return (
        <React.Fragment>
            <CommentBody 
                post={post} 
                comment={commentData} 
                showReplies={showList ? handleLoadMoreReplies : false} 
                totalReplies={repliesPage.totalCount} 
                openCommentsModal={openCommentsModal}
            />
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    commentsList: selectApiState(state, 'COMMENTS_LIST'),
    getRepliesList: selectApiState(state, COMMENTS_ROUTES.VIEW_COMMENT_REPLIES.name),
});
const mapDispatchToProps = dispatch => ({
    clearCommentData: () => dispatch(clearCommentData()),
    getCommentReplies: (postId, commentId, page, limit) => dispatch(getCommentReplies(postId, commentId, page, limit)),
    clearData: (stateValues) => dispatch(clearData(stateValues)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Comment);