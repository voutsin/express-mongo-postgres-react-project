import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatGroups from "./ChatGroups";
import Chat from "./Chat";
import { ClassNames } from "../../styles/classes";
import { connect } from "react-redux";
import ChooseNewChat from "./ChooseNewChat";
import { Button } from "../../structure/Form/Form";
import { clearChatData } from "../../redux/actions/actions";
import { selectGroupList } from "../../redux/reducers/chatReducer";


const ChatPage = props => {
    const [chat, setChat] = useState(null);
    const [receiverId, setReceiverId] = useState(null);
    const [usersView, setUsersView] = useState(false);
    const { id } = useParams();
    const { auth, groups } = props;

    const navigate = useNavigate();

    const handleSelectChat = chat => {
        setChat(chat);
        setReceiverId(null);
        props.clearData(['MESSAGES_LIST']);
    }

    const handleChooseNewUser = user => {
        setChat({
            id: null,
            members: [auth, user]
        });
        setReceiverId(user.id);
        props.clearData(['MESSAGES_LIST']);
    }

    const toggleUsersView = () => setUsersView(!usersView);

    if (auth && auth.id !== parseInt(id)) {
        navigate('/');
    }

    const chatFromGroups = chat && groups && groups.find(g => g.id === chat.id);
    const selectedChat = chatFromGroups || chat;

    return (
        <React.Fragment>
            <div className={ClassNames.CHAT_PAGE}>
                <ChatGroups userId={parseInt(id)} handleSelectChat={handleSelectChat}>
                    <div className="choose-user">
                        <Button onClick={toggleUsersView}>New Chat</Button>
                    </div>
                </ChatGroups>
                <Chat key={`chat-${selectedChat ? selectedChat.id : receiverId}`} chat={selectedChat} currentUserId={parseInt(id)} receiverId={receiverId}/>
                {usersView && <ChooseNewChat handleChooseNewUser={handleChooseNewUser}/>}
            </div>    
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    auth: state && state.auth,
    groups: selectGroupList(state),
});

const mapDispatchToProps = dispatch => ({
    clearData: values => dispatch(clearChatData(values)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatPage);