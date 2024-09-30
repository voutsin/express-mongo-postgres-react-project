import React, { useCallback, useEffect, useState } from "react";
import { ClassNames } from "../../styles/classes";
import { connect } from "react-redux";
import { addNewPost, clearData, updatePost } from "../../redux/actions/actions";
import { selectApiState } from "../../redux/reducers/apiReducer";
import { POSTS_ROUTES } from "../../config/apiRoutes";
import PostForm from "./PostForm";
import Loader from "../../structure/Loader";

const PostFormModal = props => {
    const [loading, setLoading] = useState(false);

    const { publishPost, updatePost, updatedPost, newPostData, updatePostData, clearData } = props;

    const clearPostApiData = useCallback(() => {
        clearData([POSTS_ROUTES.ADD_NEW_POST.name, POSTS_ROUTES.UPDATE_POST.name]);
    }, [clearData]);

    useEffect(() => {
        if ((newPostData || updatePostData) && loading) {
            setLoading(false);
            clearPostApiData();
        }
    }, [newPostData, updatePostData, loading, clearPostApiData])

    const handlePublishPost = inputs => {
        if (updatedPost) {
            // update
            updatePost(inputs);
            setLoading(true);
        } else {
            // create new
            publishPost(inputs);
            setLoading(true);
        }
    }

    if (loading) {
        return (
            <div className={ClassNames.ADD_NEW_POST_WRAPPER}>
                <Loader mini={true}/>
            </div>
        )
    }

    return (
        <React.Fragment>
            <div className={ClassNames.ADD_NEW_POST_WRAPPER}>
                <h4>{updatedPost ? 'Update Post' : 'Create New Post'}</h4>
                <PostForm handlePublishPost={handlePublishPost} updatedPost={updatedPost} />
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    newPostData: selectApiState(state, POSTS_ROUTES.ADD_NEW_POST.name),
    updatePostData: selectApiState(state, POSTS_ROUTES.UPDATE_POST.name),
})

const mapDispatchToProps = dispatch => ({
    publishPost: data => dispatch(addNewPost(data)),
    updatePost: data => dispatch(updatePost(data)),
    clearData: stateValues => dispatch(clearData(stateValues)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PostFormModal);