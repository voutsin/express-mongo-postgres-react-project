import React, { useEffect } from "react";
import { connect } from "react-redux";
import { clearData } from "../../redux/actions/actions";
import UserProfileHeader from "./UserProfileHeader";
import UserProfileLeftSidebar from "./UserProfileLeftSidebar";
import AddNewPost from "../AddNewPost/AddNewPost";
import PostsList from "../Post/PostsList";
import { FRIENDS_ROUTES, POSTS_ROUTES, USERS_ROUTES } from "../../config/apiRoutes";

const ProfileWrapper = props => {
    const { auth, id, clearData } = props;

    useEffect(() => {
        return () => {
            clearData([
                USERS_ROUTES.FIND_BY_ID.name,
                FRIENDS_ROUTES.FIND_USER_FRIENDS.name,
                USERS_ROUTES.FIND_USER_MEDIA.name,
                POSTS_ROUTES.FIND_USER_POSTS.name,
                'POSTS_LIST',
            ]);
          };
    }, []);

    return (
        <React.Fragment>
            <UserProfileHeader userId={id}/>
            <div className="user-profile-body">
                <UserProfileLeftSidebar userId={id}/>
                <div className="user-posts-wrapper">
                    {auth && auth.id === parseInt(id) && <AddNewPost/>}
                    <PostsList userId={id}/>
                </div>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
    clearData: values => dispatch(clearData(values)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileWrapper);
