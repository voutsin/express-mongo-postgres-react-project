import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatGroups from "./ChatGroups";
import Chat from "./Chat";
import { ClassNames } from "../../styles/classes";
import { connect } from "react-redux";
import ChooseNewChat from "./ChooseNewChat";
import { Button } from "../../structure/Form/Form";
import { clearChatData, getActiveChatUsers } from "../../redux/actions/actions";
import { CHAT_STATE, selectGroupList } from "../../redux/reducers/chatReducer";
import { arraysMatch } from "../../common/utils";


const ChatPage = props => {
    const [chat, setChat] = useState(null);
    const [groups, setGroups] = useState(null);
    const [receiverId, setReceiverId] = useState(null);
    const [usersView, setUsersView] = useState(false);
    const { id } = useParams();
    
    const { auth, groupsList, getOnlineUsers } = props;

    const navigate = useNavigate();

    useEffect(() => {
        getOnlineUsers();
        setInterval(getOnlineUsers, 10000);
    }, [])

    useEffect(() => {
        if (groupsList && chat && JSON.stringify(groupsList) !== JSON.stringify(groups)) {
            setGroups(groupsList);
            const chatMembers = chat.members.map(m => m.id);
            const foundChat = groupsList.find(g => arraysMatch(g.members.map(m => m.id), chatMembers));
            if (foundChat) {
                setChat(foundChat);
            }
        }
    }, [groupsList, groups, chat]);

    const handleSelectChat = chat => {
        setChat(chat);
        setReceiverId(null);
        props.clearData([CHAT_STATE.MESSAGES_LIST]);
    }

    const handleChooseNewUser = user => {
        setChat({
            id: null,
            members: [auth, user]
        });
        setReceiverId(user.id);
        props.clearData([CHAT_STATE.MESSAGES_LIST]);
    }

    const toggleUsersView = () => setUsersView(!usersView);

    if (auth && auth.id !== parseInt(id)) {
        navigate('/');
    }

    const chatFromGroups = chat && groupsList && groupsList.find(g => g.id === chat.id);
    const selectedChat = chatFromGroups || chat;

    return (
        <React.Fragment>
            <div className={ClassNames.CHAT_PAGE}>
                <ChatGroups userId={parseInt(id)} handleSelectChat={handleSelectChat}>
                    <div className="choose-user">
                        <Button onClick={toggleUsersView}>New Chat</Button>
                    </div>
                </ChatGroups>
                <Chat 
                    key={`chat-${selectedChat ? selectedChat.id : receiverId}`} 
                    chat={selectedChat} 
                    currentUserId={parseInt(id)} 
                    receiverId={receiverId}
                    clearReceiverId={() => setReceiverId(null)}
                />
                {usersView && <ChooseNewChat handleChooseNewUser={handleChooseNewUser}/>}
            </div>    
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    auth: state && state.auth,
    groupsList: selectGroupList(state),
});

const mapDispatchToProps = dispatch => ({
    clearData: values => dispatch(clearChatData(values)),
    getOnlineUsers: () => dispatch(getActiveChatUsers()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatPage);