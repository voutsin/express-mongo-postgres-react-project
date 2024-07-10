import React from "react";
import { ClassNames } from "../../styles/classes";
import AddNewPostForm from "./AddNewPostForm";
import { connect } from "react-redux";
import { addNewPost } from "../../redux/actions/actions";
import { selectApiState } from "../../redux/reducers/apiReducer";
import { POSTS_ROUTES } from "../../config/apiRoutes";

const AddNewPostModal = props => {

    const { publishPost } = props;

    const handlePublishPost = inputs => {
        console.log("inputs: ", inputs)
        publishPost(inputs);
    }

    return (
        <React.Fragment>
            <div className={ClassNames.ADD_NEW_POST_WRAPPER}>
                <h4>Create New Post</h4>
                <AddNewPostForm handlePublishPost={handlePublishPost} />
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    newPostData: selectApiState(state, POSTS_ROUTES.ADD_NEW_POST.name)
})

const mapDispatchToProps = dispatch => ({
    publishPost: data => dispatch(addNewPost(data)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddNewPostModal);