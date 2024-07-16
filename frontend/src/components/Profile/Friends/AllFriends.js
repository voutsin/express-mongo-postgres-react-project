import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { selectApiState } from "../../../redux/reducers/apiReducer";
import { FRIENDS_ROUTES } from "../../../config/apiRoutes";
import { clearData, getDetailedUserFriends } from "../../../redux/actions/actions";
import Loader from "../../../structure/Loader";
import { getDeepProp } from "../../../common/utils";
import { ClassNames } from "../../../styles/classes";
import UserImage from "../../../structure/User/UserImage";
import UserName from "../../../structure/User/UserName";
import { FriendStatusMapping } from "../../../common/enums";
import FriendActionButtons from "./FriendActionButtons";

const AllFriends = props => {
    const [userName, setUserName] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userFriendsCall, setUserFriendsCall] = useState(false);
    const [userFriends, setUserFriends] = useState(false);
    const [selectedTab, setSelectedTab] = useState(-1);
    const [tabs, setTabs] = useState(null);

    const { auth, userId, getDetailedUserFriends, detailedUserFriends, clearData } = props;

    useEffect(() => {
        if (userId) {
            getDetailedUserFriends(userId);
        }
    }, [userId, getDetailedUserFriends]);

    useEffect(() => {
        if (detailedUserFriends && detailedUserFriends.success && !userFriendsCall) {
            const friends = [
                ...detailedUserFriends.data.friends,
            ].filter(f => f.status === 3);
            setUserFriendsCall(true);
            setLoading(false);
            setUserFriends(friends);
            setUserName(getDeepProp(detailedUserFriends, 'data.user.name'));
            setSelectedTab(3);
            setTabs(detailedUserFriends.data.counters)
        }

    }, [detailedUserFriends, userFriendsCall]);

    useEffect(() => {
        return () => {
            clearData([
                FRIENDS_ROUTES.FIND_DETAILED_USER_FRIENDS.name,
            ]);
          };
    }, []);

    const handleClickTab = (status) => {
        setSelectedTab(parseInt(status));
        const filtered = detailedUserFriends.data.friends.filter(f => f.status === parseInt(status));
        setUserFriends(filtered);
    }

    if (loading) {
        return <div className={ClassNames.USER_FRIENDS_WRAPPER}><Loader mini={true}/></div>
    }

    const displayedUserIsCurrent = auth && auth.id === parseInt(userId);

    return (
        <React.Fragment>
            <div className={ClassNames.USER_FRIENDS_WRAPPER}>
                <div className="header">
                    <h4>{`${userName || 'User'}'s Friends`}</h4>
                </div>
                {displayedUserIsCurrent && 
                    <div className={ClassNames.FRIENDSHIPS_TABS}>
                        {tabs && Object.keys(tabs)
                        .map(key => {
                            const statusKey = parseInt(key);
                            const isSelected = selectedTab === statusKey;
                            return statusKey !== 4 ? (
                                <div 
                                    key={`tab-${statusKey}`} 
                                    className={`tab ${isSelected ? 'active' : ''}`} 
                                    onClick={() => handleClickTab(statusKey)}
                                >
                                    <span className="text">{FriendStatusMapping[statusKey].name}</span>
                                </div>
                            ) : null
                        })}
                    </div>
                }
                <div className={ClassNames.USER_FRIENDS_LIST}>
                    {userFriends && userFriends.length > 0 && 
                        userFriends.map((friend, index) => {
                            const user = friend.friend;
                            const status = friend.status;
                            const currentUser = auth && auth.id === user.id;
                            return user && (
                                <div key={`user-${user.id}${index}`} className={ClassNames.USER_ITEM}>
                                    <UserImage
                                        id={user.id}
                                        picUrl={user.profilePictureThumb}
                                        username={user.username}
                                        className={ClassNames.THUMBNAIL_IMG}
                                    />
                                    <span className={ClassNames.USER_INFO}>
                                        <UserName name={user.name} id={user.id}/>
                                    </span>
                                    {currentUser 
                                        ? <span className={ClassNames.MESSAGE_ICON}></span>
                                        : <FriendActionButtons requestedUserId={userId} friend={user} friendshipStatus={status}/>
                                    }
                                    
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    auth: state && state.auth,
    detailedUserFriends: selectApiState(state, FRIENDS_ROUTES.FIND_DETAILED_USER_FRIENDS.name),
    sendRequestResponse: selectApiState(state, FRIENDS_ROUTES.REQUEST_FRIENDSHIP.name),
});

const mapDispatchToProps = dispatch => ({
    getDetailedUserFriends: userId => dispatch(getDetailedUserFriends(userId)),
    clearData: values => dispatch(clearData(values)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AllFriends);