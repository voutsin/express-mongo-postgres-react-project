import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { selectApiState } from "../../redux/reducers/apiReducer";
import { BASE_URL, USERS_ROUTES } from "../../config/apiRoutes";
import { getUserInfo } from "../../redux/actions/actions";
import { MdFace } from "react-icons/md";
import Loader from "../../structure/Loader";
import {ClassNames} from "../../styles/classes.js";

const UserProfileHeader = props => {
    const [loading, setLoading] = useState(true);
    const [userDetailsCall, setUserDetailsCall] = useState(false);
    const [userInfo, setUserInfo] = useState(false);

    const { userId, getUserDetails, userDetails } = props;

    useEffect(() => {
        if (userId) {
            getUserDetails(userId);
        }
    }, [getUserDetails, userId]);

    useEffect(() => {
        if (userDetails && userDetails.success && !userDetailsCall) {
            setUserDetailsCall(true);
            setLoading(false);
            setUserInfo(userDetails.data);
        }

        if (!userDetails || !userDetails.success) {
            setUserDetailsCall(false);
            setUserInfo(false);
        }

    }, [userDetails, userDetailsCall]);

    if (loading) {
        return <Loader mini={true}/>
    }

    return (
        <React.Fragment>
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
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    userDetails: selectApiState(state, USERS_ROUTES.FIND_BY_ID.name),
});

const mapDispatchToProps = dispatch => ({
    getUserDetails: userId => dispatch(getUserInfo(userId)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserProfileHeader);