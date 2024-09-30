import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button } from "../../../structure/Form/Form";
import { getDeepProp } from "../../../common/utils";
import { selectApiState } from "../../../redux/reducers/apiReducer";
import { FRIENDS_ROUTES } from "../../../config/apiRoutes";
import { blockUser, deleteComment, deletePost } from "../../../redux/actions/actions";

const OptionsModal = props => {
    const [userId, setUserId] = useState(null);

    const {
        post, // filled if post reference
        comment, // filled if comment reference
        auth,
    } = props;

    useEffect(() => {
        if ((post || comment) && !userId) {
            const exists = post 
            ? post.userId || getDeepProp(post, 'user.id') 
            : comment 
                ? comment.userId || getDeepProp(comment, 'user.id') 
                : null;
            setUserId(exists || -1);
        }
    }, [post, comment, userId]);

    if (!post && !comment) {
        return <React.Fragment/>
    }

    const handleDelete = () => {
        if (post) {
            props.deletePost(post);
        } else if (comment) {
            props.deleteComment(comment);
        } 
    }

    const handleUpdate = () => {
        if (post) {
            props.handleUpdatePost(post);
        } else if (comment) {
            props.handleUpdateComment(comment);
        }
    }

    const handleBlockUser = () => {
        if (userId) {
            props.blockUser(userId);
        }
    }

    const currentUser = auth && auth.id === userId;
    return (
        <React.Fragment>
            <div className="options">
                {currentUser && 
                    <React.Fragment>
                        <Button className="btn" onClick={handleUpdate}>Edit</Button>
                        <Button className="btn" onClick={handleDelete}>Delete</Button>
                    </React.Fragment>
                }
                {!currentUser && <Button className="btn" onClick={handleBlockUser}>Block</Button>}
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    auth: state.auth,
    blockUserResponse: selectApiState(state, FRIENDS_ROUTES.BLOCK_FRIEND.name)
});
const mapDispatchToProps = dispatch => ({
    // delete item
    deleteComment: comment => dispatch(deleteComment(comment)),
    deletePost: id => dispatch(deletePost(id)),
    // user
    blockUser: id => dispatch(blockUser(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OptionsModal);