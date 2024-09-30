import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { clearData, findUserFriends } from "../../redux/actions/actions";
import { selectApiState } from "../../redux/reducers/apiReducer";
import { FRIENDS_ROUTES } from "../../config/apiRoutes";
import { ClassNames } from "../../styles/classes";
import UserChatView from "../Home/UserChatView";

const ChooseNewChat = props => {
    const [friends, setFriends] = useState(null);

    const { auth, getAllFriends, friendsList, handleChooseNewUser } = props;

    useEffect(() => {
        if (auth && !friendsList) {
            getAllFriends(auth.id);
        }
    }, [auth, getAllFriends, friendsList]);

    useEffect(() => {
        if (friendsList && JSON.stringify(friendsList) !== JSON.stringify(friends)) {
            setFriends(friendsList.data.friends);
        }
    }, [friendsList, friends]);

    useEffect(() => {
        return () => {
            // clear data
            props.clearData([FRIENDS_ROUTES.FIND_USER_FRIENDS.name])
        };
      }, []);

    return (
        <React.Fragment>
            <div className={ClassNames.FRIENDS_VIEW}>
                <h4>Your Friends</h4>
                {friends && friends.length > 0 ? 
                    <div>
                        {friends && friends.map(friend => {
                            const info = friend.friend;
                            return (
                                <UserChatView userInfo={info} onClick={() => handleChooseNewUser(info)} />
                            )
                        })}
                    </div>
                : <span className={ClassNames.NO_FRIENDS}>You don't have any friends yet. <br/>Try to connect with other users to start chating!</span>}
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    auth: state && state.auth,
    friendsList: selectApiState(state, FRIENDS_ROUTES.FIND_USER_FRIENDS.name),
});

const mapDispatchToProps = dispatch => ({
    getAllFriends: userId => dispatch(findUserFriends(userId)),
    clearData: values => dispatch(clearData(values)),
});

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(ChooseNewChat);