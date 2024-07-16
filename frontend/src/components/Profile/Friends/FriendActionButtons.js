import React, { useCallback, useEffect, useState } from "react";
import { ClassNames } from "../../../styles/classes";
import { Button } from "../../../structure/Form/Form";
import { MdSend } from "react-icons/md";
import SelectInput from "../../../structure/Form/SelectInput";
import { FriendUserAction, NotifyTypes } from "../../../common/enums";
import { connect } from "react-redux";
import { acceptFriendRequest, blockUser, cancelFriendRequest, clearData, declineFriendRequest, deleteFriendship, getDetailedUserFriends, sendFriendRequest, unBlockUser } from "../../../redux/actions/actions";
import { selectApiState } from "../../../redux/reducers/apiReducer";
import Loader from "../../../structure/Loader";

const FriendActionButtons = props => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const { 
        auth, 
        requestedUserId, 
        friend, 
        friendshipStatus,
        notification,
        // // actions
        clearData,
        getDetailedUserFriends,
    } = props;

    const handleResponse = useCallback((data) => {
        setLoading(false);
        setMessage(data.message);
        if (auth.id === parseInt(requestedUserId)) {
            // displayed user is current
            getDetailedUserFriends(requestedUserId); // the response is handled by parent 
        }
        setTimeout(() => {
            setMessage(null);
            clearData(['notify']);
        }, 5000);
    }, [auth, requestedUserId, clearData, getDetailedUserFriends]);

    useEffect(() => {
        if (notification && notification.type !== NotifyTypes.ERROR && friend && friend.id === notification.extraData.friendId) {
            handleResponse(notification);
            
        } else {
            setLoading(false);
        }
    }, [friend, notification, handleResponse]);

    const handleOpenChat = () => {
        // TODO: open chat when selecting message button
    }

    const handleUserAction = (name, value) => {
        const actionInfo = Object.values(FriendUserAction).find(v => v.value === value);
        if (actionInfo) {
            setLoading(true);
            const action = props[actionInfo.action];
            action(friend.id);
        }
    }

    const getUserActionOptions = (status, user) => {
        let options = [];

        if (auth.id === parseInt(requestedUserId)) {
            // displayed user is current
            options = optionsMap(status);
        } else {
            options = optionsMap(parseInt(user.isFriendsStatus));
        }

        return options;
    }

    const optionsMap = status => {
        switch(status) {
            case 1:
                // requested friendship
                return [
                    FriendUserAction.CANCEL_REQUEST,
                    FriendUserAction.BLOCK
                ]
            case 2:
                // pending acceptance
                return [
                    FriendUserAction.ACCEPT,
                    FriendUserAction.DECLINE,
                    FriendUserAction.BLOCK
                ]
            case 3:
                // friends
                return [
                    FriendUserAction.UNFRIEND,
                    FriendUserAction.BLOCK
                ]
            case 4:
                // blocked
                return [
                    FriendUserAction.UNBLOCK
                ]
            default:
                // not friends
                return [
                    FriendUserAction.REQUEST,
                    FriendUserAction.BLOCK
                ]
        }
    }

    const options = getUserActionOptions(friendshipStatus, friend);

    if (message) {
        return (
            <div className="actions">
                <span>{message}</span>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="actions">
                <Loader mini={true}/>
            </div>
        ); 
    }

    return (
        <React.Fragment>
            <div className="actions">
                {friend.isFriends && 
                    <div className="chat">
                        <Button onClick={() => handleOpenChat(friend.id)} className={ClassNames.MESSAGE_ICON}>
                            <MdSend/>
                        </Button>
                    </div>
                }
                <div className="options-input">
                    <SelectInput options={options} onChange={handleUserAction} compact={true}/>
                </div>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    auth: state && state.auth,
    notification: selectApiState(state, 'notify'),
});

const mapDispatchToProps = dispatch => ({
    sendFriendRequest: friendId => dispatch(sendFriendRequest(friendId)),
    cancelFriendRequest: friendId => dispatch(cancelFriendRequest(friendId)),
    acceptFriendRequest: friendId => dispatch(acceptFriendRequest(friendId)),
    declineFriendRequest: friendId => dispatch(declineFriendRequest(friendId)),
    deleteFriendship: friendId => dispatch(deleteFriendship(friendId)),
    unBlockUser: friendId => dispatch(unBlockUser(friendId)),
    blockUser: friendId => dispatch(blockUser(friendId)),
    clearData: values => dispatch(clearData(values)),
    getDetailedUserFriends: userId => dispatch(getDetailedUserFriends(userId)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FriendActionButtons);