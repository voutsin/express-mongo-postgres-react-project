import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { selectGroupList } from "../../redux/reducers/chatReducer";
import { clearChatData, getMessageGroups } from "../../redux/actions/actions";
import Loader from "../../structure/Loader";
import { findGroupNameByMembers } from "../../common/utils";
import { ClassNames } from "../../styles/classes";
import { MdGroup } from "react-icons/md";
import UserImage from "../../structure/User/UserImage";
import { useLocation } from "react-router-dom";

const ChatGroups = props => {
    const [groups, setGroups] = useState(null);
    const [loading, setLoading] = useState(true);
    const [externalUserFlag, setExternalUserFlag] = useState(false);

    const { auth, children, userId, groupsList, getMessageGroupsList, handleSelectChat } = props;

    const location = useLocation();

    useEffect(() => {
        const externalUser = location && location.state && location.state.externalUser;
        if (externalUser && auth && groupsList && !externalUserFlag) {
            const foundInGroups = groupsList.filter(g => g.members.length === 2) // select only single chats
                .find(g => g.members.some(m => m.id === externalUser.id));
            
            const newChat = foundInGroups || {
                id: null,
                members: [auth, externalUser]
            };
            handleSelectChat(newChat);
            setExternalUserFlag(true);
        }
    }, [location, auth, groupsList, handleSelectChat, externalUserFlag]);

    useEffect(() => {
        // load all message groups
        getMessageGroupsList();
      
        // return () => {
        //     // clear data
        //     clearData(['GROUPS_LIST'])
        // };
      }, []);

    useEffect(() => {
        if (groupsList && JSON.stringify(groupsList) !== JSON.stringify(groups)) {
            setGroups(groupsList);
            setLoading(false);
        }
    }, [groupsList, groups]);

    if (loading) {
        return <div className={ClassNames.CHAT_GROUPS_WRAPPER}>
            <Loader mini={true}/>
        </div>
    }

    return (
        <React.Fragment>
            <div className={ClassNames.CHAT_GROUPS_WRAPPER}>
                <div className={ClassNames.CHAT_GROUPS_INNER}>
                    {groups && groups.length > 0 && 
                        <div className={ClassNames.CHAT_GROUPS}>
                            {groups.map(group => {
                                const groupName = group.groupName || findGroupNameByMembers(group.members, parseInt(userId));
                                const others = group.members.filter(u => u.id !== userId);
                                const user = others[0];
                                return (
                                    <div 
                                        key={`chat-${group.id}`} 
                                        className={ClassNames.GROUP_CHAT} 
                                        onClick={() => handleSelectChat(group)}
                                    >
                                        {group.hasNewMessage && 
                                            <div className={ClassNames.UNREAD_MESSAGES}>
                                                <span>{group.hasNewMessage}</span>
                                            </div>
                                        }
                                        <div className="icon">
                                            {others && others.length > 1  
                                                ? <div className="icon"><MdGroup/></div>
                                                : <UserImage
                                                    id={user.id}
                                                    picUrl={user.profilePictureThumb}
                                                    username={user.username}
                                                    className={ClassNames.THUMBNAIL_IMG}
                                                />
                                            }
                                        </div>
                                        <div className="text">
                                            <span>{groupName}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    }
                    {children}
                </div>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    auth: state && state.auth,
    groupsList: selectGroupList(state),
});
const mapDispatchToProps = dispatch => ({
    getMessageGroupsList: () => dispatch(getMessageGroups()),
    clearData: (values) => dispatch(clearChatData(values)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatGroups);