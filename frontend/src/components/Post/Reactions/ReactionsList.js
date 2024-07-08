import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import UserImage from "../../../structure/User/UserImage";
import UserName from "../../../structure/User/UserName";
import { Button, LoadingButton } from "../../../structure/Form/Form";
import { ClassNames } from "../../../styles/classes";
import { clearData, getCommentReactions, getPostReactions, sendFriendRequest } from "../../../redux/actions/actions";
import { selectApiState } from "../../../redux/reducers/apiReducer";
import { FRIENDS_ROUTES, REACTIONS_ROUTES } from "../../../config/apiRoutes";
import { MdPersonAdd, MdSend } from "react-icons/md";
import Loader from "../../../structure/Loader";
import { getDeepProp } from "../../../common/utils";

const ReactionsList = props => {
    const [callFlag, setCallFlag] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sendRequestCall, setSendRequestCall] = useState(false);

    const { auth } = props;

    useEffect(() => {
        if (props.postId != null && !callFlag) {
            props.getPostReactions(props.postId);
            setCallFlag(true)
        }

        if (props.commentId != null && !callFlag) {
            props.getCommentReactions(props.commentId);
            setCallFlag(true)
        }

        if (props.postReactionsResponse && props.postReactionsResponse.success && loading) {
            setLoading(false)
        }

        if (props.commentReactionsResponse && props.commentReactionsResponse.success && loading) {
            setLoading(false)
        }

        if (props.sendRequestResponse && props.sendRequestResponse.success && !sendRequestCall) {
            props.clearData([FRIENDS_ROUTES.REQUEST_FRIENDSHIP.name]);
            setSendRequestCall(true);
        }

    }, [props, callFlag, loading, sendRequestCall])

    useEffect(() => {
        return () => {
            props.clearData([
                FRIENDS_ROUTES.REQUEST_FRIENDSHIP.name, 
                REACTIONS_ROUTES.VIEW_POST_REACTIONS.name,
                REACTIONS_ROUTES.VIEW_COMMENT_REACTIONS.name,
            ]);
          };
    }, [])

    if (loading) {
        return <Loader mini={true} />
    }

    const reactionList = getDeepProp(props, 'postReactionsResponse.data') || getDeepProp(props, 'commentReactionsResponse.data');

    const handleSendRequest = userId => {
        if (userId) {
            setSendRequestCall(false);
            props.sendFriendRequest(userId);
        }
    }

    const handleOpenChat = () => {
        // TODO: open chat when selecting message button
        setTimeout(() => {
            setSendRequestCall(true)
        }, 5000);
    }

    return (
        <React.Fragment>
            {reactionList && reactionList.length > 0 
                ? <div className="reaction-list-wrapper">
                    <div className="reaction-tabs">

                    </div>
                    <div className="reaction-list">
                        {reactionList.map(item => {
                            const user = item.user;
                            const currentUser = auth && auth.id === user.id;
                            return (
                                <div className={ClassNames.USER_ITEM}>
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
                                        : user.isFriends 
                                            ? <Button onClick={() => handleOpenChat(user.id)} className={ClassNames.MESSAGE_ICON}><MdSend/></Button>
                                            : <LoadingButton 
                                                onClick={() => handleSendRequest(user.id)} 
                                                className={ClassNames.MESSAGE_ICON}
                                                apiCall={sendRequestCall}
                                                >
                                                    <MdPersonAdd/>
                                                </LoadingButton>}
                                    
                                </div>
                            )
                        })}
                    </div>
                </div>
                : <p>No reactions placed yet.</p>
            }
        </React.Fragment>
    )
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    postReactionsResponse: selectApiState(state, REACTIONS_ROUTES.VIEW_POST_REACTIONS.name),
    commentReactionsResponse: selectApiState(state, REACTIONS_ROUTES.VIEW_COMMENT_REACTIONS.name),
    sendRequestResponse: selectApiState(state, FRIENDS_ROUTES.REQUEST_FRIENDSHIP.name),
});

const mapDispatchToProps = (dispatch) => ({
    getPostReactions: id => dispatch(getPostReactions(id)),
    getCommentReactions: id => dispatch(getCommentReactions(id)),
    sendFriendRequest: id => dispatch(sendFriendRequest(id)),
    clearData: stateValues => dispatch(clearData(stateValues)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReactionsList);