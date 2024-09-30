import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { selectApiState } from "../../redux/reducers/apiReducer";
import { BASE_URL, USERS_ROUTES } from "../../config/apiRoutes";
import { getUserInfo } from "../../redux/actions/actions";
import { MdFace } from "react-icons/md";
import Loader from "../../structure/Loader";
import {ClassNames} from "../../styles/classes.js";
import { Button } from "../../structure/Form/Form.js";
import FriendActionButtons from "./Friends/FriendActionButtons.js";
import Modal from "../../structure/Modal.js";
import EditUser from "./EditUser.js";

const UserProfileHeader = props => {
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(false);
    const [editUserFlag, openEditProfileModal] = useState(false);

    const { userId, getUserDetails, userDetails, auth } = props;

    useEffect(() => {
        if (userId) {
            getUserDetails(userId);
        }
    }, [getUserDetails, userId]);

    useEffect(() => {
        if (userDetails && JSON.stringify(userDetails) !== JSON.stringify(userInfo)) {
            setLoading(false);
            setUserInfo(userDetails.data);
            openEditProfileModal(false);
        }

        if (!userDetails || !userDetails.success) {
            setUserInfo(false);
        }

    }, [userDetails, userInfo]);

    if (loading) {
        return <Loader mini={true}/>
    }

    const editUserModal = (
        <Modal
            handleClose={() => openEditProfileModal(false)}
            flag={editUserFlag}
        >
            <EditUser/>
        </Modal>
    )

    const userIsTheActive = userInfo && auth && userInfo.id === auth.id;

    return (
        <React.Fragment>
            {editUserFlag && userIsTheActive ? editUserModal : null}
            <div className={ClassNames.USER_HEADER_WRAPPER}>
                <div className={ClassNames.USER_PROFILE_IMG}>
                    {userInfo 
                        ? <img alt="user-pic" src={`${BASE_URL}/${userInfo.profilePictureThumb}`}/>
                        : <div className="placeholder">
                            <MdFace /> 
                        </div>
                    }
                </div>
                <div className={ClassNames.USER_PROFILE_INFO}>
                    <div className={ClassNames.USERNAME_DIV}>
                        <span className="name">{userInfo.name}</span>
                        <span className="username">@{userInfo.username}</span>
                    </div>
                    <div className={ClassNames.USER_INFO_DIV}>
                        <div>
                            <span className="title">Email: </span>
                            <span className="text">{userInfo.email}</span>
                        </div>
                        <div>
                            <span className="title">Birth Date: </span>
                            <span className="text">{userInfo.birthDate}</span>
                        </div>
                        <div>
                            <span className="title">Description: </span>
                            <span className="text">{userInfo.description}</span>
                        </div>
                        <div>
                            <span className="title">Joined Since: </span>
                            <span className="text">{userInfo.createdAt}</span>
                        </div>
                    </div>
                </div>
                <div className={ClassNames.USER_PROFILE_ACTIONS}>
                    {userIsTheActive 
                        ? <Button className={ClassNames.INVISIBLE_BTN} onClick={() => openEditProfileModal(true)}>Edit Profile</Button>
                        : <FriendActionButtons requestedUserId={auth.id} friend={userInfo} friendshipStatus={parseInt(userInfo.isFriendsStatus)}/>
                    }
                </div>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    auth: state && state.auth,
    userDetails: selectApiState(state, USERS_ROUTES.FIND_BY_ID.name),
});

const mapDispatchToProps = dispatch => ({
    getUserDetails: userId => dispatch(getUserInfo(userId)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserProfileHeader);