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
import { buildUrl, getDeepProp } from "../../../common/utils";
import { ReactionMapping } from "../../../common/enums";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../config/routes";

const ReactionsList = props => {
    const [callFlag, setCallFlag] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sendRequestCall, setSendRequestCall] = useState(false);
    const [reactionList, setReactionList] = useState([]);
    const [selectedTab, setSelectedTab] = useState(-1);

    const navigate = useNavigate();

    const { auth, reactionsNumber } = props;

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
            setSelectedTab(Object.keys(reactionsNumber).findIndex(key => key === 'total'));
            setReactionList(props.postReactionsResponse.data);
            setLoading(false)
        }

        if (props.commentReactionsResponse && props.commentReactionsResponse.success && loading) {
            setSelectedTab(Object.keys(reactionsNumber).findIndex(key => key === 'total'));
            setReactionList(props.commentReactionsResponse.data);
            setLoading(false)
        }

        if (props.sendRequestResponse && props.sendRequestResponse.success && !sendRequestCall) {
            props.clearData([FRIENDS_ROUTES.REQUEST_FRIENDSHIP.name]);
            setSendRequestCall(true);
        }

    }, [props, callFlag, loading, sendRequestCall, reactionsNumber])

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

    const handleSendRequest = userId => {
        if (userId) {
            setSendRequestCall(false);
            props.sendFriendRequest(userId);
        }
    }

    const handleOpenChat = (user) => {
        navigate(buildUrl(ROUTES.CHAT.path, {id: auth.id}), { state: { externalUser: user } });
    }

    const handleClickTab = (reactionType, targetIndex) => {
        setSelectedTab(targetIndex);
        const allReactions = getDeepProp(props, 'postReactionsResponse.data') || getDeepProp(props, 'commentReactionsResponse.data') || [];
        if (reactionType === 'total') {
            setReactionList(allReactions);
        } else {
            const filtered = allReactions.filter(reaction => reaction.reactionType === parseInt(reactionType));
            setReactionList(filtered);
        }
    }

    return (
        <React.Fragment>
            {reactionList && reactionList.length > 0 
                ? <div className="reaction-list-wrapper">
                    <div className="reaction-tabs">
                        {reactionsNumber && Object.keys(reactionsNumber)
                        .map((key, index) => {
                            if (reactionsNumber[key] > 0) {
                                const isSelected = selectedTab === index;
                                return key === 'total' 
                                ? <div 
                                        key={`tab-${index}`} 
                                        className={`tab total ${isSelected ? 'active' : ''}`}
                                        onClick={() => handleClickTab(key, index)}
                                    >
                                        <span className="text">All</span>
                                    </div>
                                : (
                                    <div 
                                        key={`tab-${index}`} 
                                        className={`tab ${ReactionMapping[key].className} ${isSelected ? 'active' : ''}`} 
                                        onClick={() => handleClickTab(key, index)}
                                    >
                                        <span className="icon">{ReactionMapping[key].icon}</span>
                                        <span className="text">{reactionsNumber[key]}</span>
                                    </div>
                                )
                            }
                            return null;
                        })}
                    </div>
                    <div className="reaction-list">
                        {reactionList.map((item, index) => {
                            const user = item.user;
                            const currentUser = auth && auth.id === user.id;
                            return (
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
                                        : user.isFriends 
                                            ? <Button onClick={() => handleOpenChat(user)} className={ClassNames.MESSAGE_ICON}><MdSend/></Button>
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