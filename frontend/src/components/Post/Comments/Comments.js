import React, { useEffect, useRef, useState } from "react";
import { ClassNames } from "../../../styles/classes";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { connect } from "react-redux";
import { selectApiState, selectCommentsData } from "../../../redux/reducers/apiReducer";
import { clearData, getPostComments, resetCommentList } from "../../../redux/actions/actions";
import { COMMENTS_ROUTES } from "../../../config/apiRoutes";

const CommentsSection = props => {
    const commentRef = useRef(null);
    const [fetchComments, setFetchComments] = useState(false);
    const [postComments, setPostComments] = useState(false);
    const [page, setPage] = useState({ page: 1, limit: 2, totalCount: 0, totalPages: 0});

    const { post, inputFocus, showList, commentsList } = props;

    useEffect(() => {
        // for load more btn
        if (commentsList && fetchComments) {
            setPostComments(commentsList[post.id]);
            setFetchComments(false);
        }

        if (props.getCommentsList && props.getCommentsList.success && !fetchComments) {
            const data = Object.assign({}, props.getCommentsList.data)
            props.clearData([COMMENTS_ROUTES.VIEW_POST_COMMENTS.name]);
            setFetchComments(true);
            setPage({
                ...page,
                page: data.currentPage,
                totalCount: data.totalCount,
                totalPages: data.totalPages
            });
        }

    }, [props, commentsList, fetchComments, post, page]);

    useEffect(() => {
        // mount
        if (props.showList && props.post) {
            props.getPostComments(props.post.id, page.page, page.limit);
            commentRef.current.classList.add(ClassNames.DISPLAY);
        }

        return () => {
            // unmount
            props.resetCommentList();
          };
    }, []);

    const handleLoadMoreComments = () => {
        props.getPostComments(post.id, page.page + 1, page.limit);
        setFetchComments(false);
    }

    const loadMore = postComments && postComments.length < page.totalCount;

    const comments = post && commentsList ? commentsList[post.id] || [] : [];

    return (
        <React.Fragment>
            <div className={ClassNames.COMMENTS_WRAPPER}>
                <h4>Comments</h4>
                {showList && comments.length > 0 &&
                    <React.Fragment>
                        <div className={ClassNames.COMMENTS_LIST}>
                            {comments.map((comment, index) => {
                                return (
                                    <Comment 
                                        key={`com-${post.id}${comment.id}${index}`} 
                                        post={post} 
                                        comment={comment} 
                                        showList={true}
                                    />
                                )
                            })}
                            {loadMore && 
                                <div className="load-more">
                                    <span onClick={handleLoadMoreComments}>load more...</span>
                                </div>
                            }
                        </div>
                    </React.Fragment>
                }
            </div>
            <div className={ClassNames.COMMENTS_LIST_ADD_NEW}>
                <CommentForm post={post} commentRef={commentRef} inputFocus={inputFocus} />
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    commentsList: selectCommentsData(state),
    getCommentsList: selectApiState(state, COMMENTS_ROUTES.VIEW_POST_COMMENTS.name),
});

const mapDispatchToProps = dispatch => ({
    getPostComments: (postId, page, limit) => dispatch(getPostComments(postId, page, limit)),
    resetCommentList: () => dispatch(resetCommentList()),
    clearData: (stateValues) => dispatch(clearData(stateValues)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommentsSection);