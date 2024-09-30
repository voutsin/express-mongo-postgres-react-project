import React, { useEffect, useState } from "react";
import Loader from "../../../structure/Loader";
import { connect } from "react-redux";
import { selectApiState } from "../../../redux/reducers/apiReducer";
import { BASE_URL, FRIENDS_ROUTES } from "../../../config/apiRoutes";
import { findUserFriends } from "../../../redux/actions/actions";
import { MdFace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { buildUrl } from "../../../common/utils";
import { ROUTES } from "../../../config/routes";
import { ClassNames } from "../../../styles/classes";
import Modal from "../../../structure/Modal";
import AllFriends from "./AllFriends";

const UserFriends = props => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userFriendsCall, setUserFriendsCall] = useState(false);
    const [userFriends, setUserFriends] = useState(false);
    const [viewAllFlag, openViewAllModal] = useState(false);

    const { userId, getUserFriends, userFriendsList } = props;

    useEffect(() => {
        if (userId) {
            getUserFriends(userId);
        }
    }, [getUserFriends, userId]);

    useEffect(() => {
        if (userFriendsList && userFriendsList.success && !userFriendsCall) {
            const friends = [
                ...userFriendsList.data.friends,
            ]
            setUserFriendsCall(true);
            setLoading(false);
            setUserFriends(friends.filter((f, index) => index < 9));
        }

        if (!userFriendsList || !userFriendsList.success) {
            setUserFriendsCall(false);
            setUserFriends(false);
        }

    }, [userFriendsList, userFriendsCall]);

    const handleClickFriend = friendId => {
        navigate(buildUrl(`${ROUTES.PROFILE.path}`, { id: friendId }));
    }

    if (loading) {
        return <Loader mini={true}/>
    }

    const viewAllModal = (
        <Modal
            handleClose={() => openViewAllModal(false)}
            flag={viewAllFlag}
        >
            <AllFriends
                userId={userId}
            />
        </Modal>
    )

    return (
        <React.Fragment>
            <div className={ClassNames.USER_PROFILE_FRIENDS_WRAPPER}>
                <div className="header">
                    <h4>Friends</h4>
                    <div className="view-more">
                        <span onClick={() => openViewAllModal(true)}>View all friends</span>
                    </div>
                </div>
                <div className={ClassNames.USER_FRIENDS_LIST}>
                    {userFriends && userFriends.length > 0 && 
                        userFriends.map(friend => {
                            const user = friend.friend;
                            return user && (
                                <div key={`${user.username}`} className={ClassNames.USER_FRIEND_ITEM}>
                                    <div className="pic" onClick={() => handleClickFriend(user.id)}>
                                        {user.profilePictureThumb ? 
                                            <img 
                                                src={`${BASE_URL}/${user.profilePictureThumb}`} 
                                                alt={user.username}
                                            /> 
                                            : <div className="icon"><MdFace /></div>
                                        }
                                    </div>
                                    <div className="info">
                                        <span className="name" onClick={() => handleClickFriend(user.id)}>{user.name}</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            {viewAllFlag && viewAllModal}
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    userFriendsList: selectApiState(state, FRIENDS_ROUTES.FIND_USER_FRIENDS.name),
});

const mapDispatchToProps = dispatch => ({
    getUserFriends: userId => dispatch(findUserFriends(userId)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserFriends);