import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { selectApiState } from "../../redux/reducers/apiReducer";
import { FRIENDS_ROUTES } from "../../config/apiRoutes";
import { findUserFriends } from "../../redux/actions/actions";
import { getDeepProp } from "../../common/utils";
import UserChatView from "./UserChatView";
import { ClassNames } from "../../styles/classes";

// TODO: add user online status
const FriendsColumn = props => {
    const [friendsCallFlag, setFriendsCallFlag] = useState(false);

    useEffect(() => {
        if (props.auth && props.auth.id && !friendsCallFlag) {
            props.findUserFriends(props.auth.id);
            setFriendsCallFlag(true);
        }
    }, [props, friendsCallFlag]);

    const friends = getDeepProp(props, 'findUserFriendsResponse.data.friends');

    const handleUserClick = info => {
        // TODO: add chat window
        console.log("user: ", info)
    }

    return (
        <React.Fragment>
            <div className={ClassNames.FRIENDS_VIEW}>
                <h4>Your Friends</h4>
                {friends && friends.length > 0 ? 
                    <div>
                        {friends && friends.map(friend => {
                            const info = friend.friend;
                            return (
                                <UserChatView userInfo={info} onClick={handleUserClick} />
                            )
                        })}
                    </div>
                : <span className={ClassNames.NO_FRIENDS}>You don't have any friends yet. <br/>Try to connect with other users to start chating!</span>}
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    findUserFriendsResponse: selectApiState(state, FRIENDS_ROUTES.FIND_USER_FRIENDS.name),
});

const mapDispatchToProps = (dispatch) => ({
    findUserFriends: id => dispatch(findUserFriends(id)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FriendsColumn);