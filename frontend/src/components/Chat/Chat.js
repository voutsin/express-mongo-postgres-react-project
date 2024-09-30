import React, { useEffect, useState } from "react";
import TextInput from '../../structure/Form/TextInput.js';
import { Button, Form } from "../../structure/Form/Form.js";
import { MdSend } from "react-icons/md";
import { removeEmptyFields } from "../../common/utils";
import { connect } from "react-redux";
import { clearData, getGroupMessages, readGroupMessages, sendMessage } from "../../redux/actions/actions";
import { selectMessageList } from "../../redux/reducers/chatReducer";
import { selectApiState } from "../../redux/reducers/apiReducer.js";
import { ClassNames } from "../../styles/classes.js";
import UserImage from "../../structure/User/UserImage.js";
import { useLocation } from "react-router-dom";

const Chat = props => {
    const [inputs, setInputs] = useState({});
    const [messages, setMessages] = useState(null);
    const [externalMessageFlag, setExternalMessage] = useState(null);

    const location = useLocation();

    const { 
        currentUserId, 
        chat, 
        receiverId, 
        messagesList, 
        getGroupMessages, 
        sendMessage, 
        clearData, 
        error, 
        readChatMessages,
        clearReceiverId
    } = props;

    useEffect(() => {
        const externalMessage = location && location.state && location.state.externalMessage;
        if (externalMessage && !externalMessageFlag) {
            setInputs({
                content: externalMessage
            });
            setExternalMessage(true);
        }
      }, [location, externalMessageFlag]);

    useEffect(() => {
        // load all messages
        if (chat && chat.id) {
            getGroupMessages(chat.id);
        }
      }, [chat, getGroupMessages]);

    useEffect(() => {
        if (messagesList && JSON.stringify(messagesList) !== JSON.stringify(messages)) {
            setMessages(messagesList);
        }

        if (error) {
            clearData(['error']);
        }
    }, [messagesList, messages, error, clearData, chat]);

    const handleChange = (name, value) => {
        setInputs({
            ...inputs,
            [name]: value
        });
    }

    const handleSend = (e) => {
        e.preventDefault();
        removeEmptyFields(inputs);
        if (inputs.content) {
            sendMessage(inputs.content, chat.id, receiverId);
            setInputs({});
            clearReceiverId();
        }
    }

    const headerInfo = {
        users: chat && chat.members.filter(u => u.id !== currentUserId),
    }

    const handleFocus = () => {
        if (chat.hasNewMessage && chat.hasNewMessage > 0) {
            readChatMessages(chat.id);
        }
    }

    return (
        <React.Fragment>
            <div className={ClassNames.CHAT_ROOM}>
                {chat && 
                    <React.Fragment>
                        <div className={ClassNames.CHAT_HEADER}>
                            {headerInfo.users && headerInfo.users.length === 1 
                                ? <div className="user">
                                    <UserImage
                                        id={headerInfo.users[0].id}
                                        picUrl={headerInfo.users[0].profilePictureThumb}
                                        username={headerInfo.users[0].username}
                                        className={ClassNames.THUMBNAIL_IMG}
                                    />
                                    <div className="info">
                                        <span className="name">{headerInfo.users[0].name}</span>
                                        <span className="status">{headerInfo.users[0].online ? 'Online' : 'Inactive'}</span>
                                    </div>
                                </div>
                                : <div className="user">
                                    {headerInfo.users.map(user => (
                                        <UserImage
                                            id={user.id}
                                            picUrl={user.profilePictureThumb}
                                            username={user.username}
                                            className={ClassNames.THUMBNAIL_IMG}
                                            onlineStatus={user.online}
                                            showStatus={true}
                                        />
                                    ))}
                                </div>
                            }
                        </div>
                        <div className={ClassNames.MESSAGES}>
                            {messagesList && messagesList.map(message => {                                
                                const user = chat.members.find(u => u.id === message.senderId);
                                return message ? (
                                    <div key={`message-${message.id}`} className={`${ClassNames.MESSAGE}${user.id === currentUserId ? ' current' : ''}`}>
                                        <div className="user">
                                            <UserImage
                                                id={user.id}
                                                picUrl={user.profilePictureThumb}
                                                username={user.username}
                                                className={ClassNames.THUMBNAIL_IMG}
                                            />
                                        </div>
                                        <div className="text">
                                            <span>{message.content}</span>
                                        </div>
                                    </div>
                                ) : null
                            })}
                        </div>
                        <div className="form">
                            <Form data={inputs} onChange={handleChange}>
                                <TextInput
                                    type="text" 
                                    name="content"
                                    label='Message'
                                    onFocus={handleFocus}
                                />
                            </Form>
                            <Button extraClass={'send-btn'} onClick={handleSend} disabled={!inputs.content || inputs.content === ''}>
                                <MdSend/>
                            </Button>
                        </div>
                    </React.Fragment>
                }
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    messagesList: selectMessageList(state),
    error: selectApiState(state, 'error'),
});

const mapDispatchToProps = dispatch => ({
    getGroupMessages: (groupId, page, pageSize) => dispatch(getGroupMessages(groupId, page, pageSize)),
    sendMessage: (content, groupId, receiverId) => dispatch(sendMessage(content, groupId, receiverId)),
    readChatMessages: groupId => dispatch(readGroupMessages(groupId)),
    clearData: (values) => dispatch(clearData(values)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Chat);