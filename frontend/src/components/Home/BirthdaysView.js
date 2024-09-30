import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { findUserFriendsBirthdays } from "../../redux/actions/actions";
import { selectApiState } from "../../redux/reducers/apiReducer";
import { FRIENDS_ROUTES } from "../../config/apiRoutes";
import { buildUrl, getDeepProp } from "../../common/utils";
import { ClassNames } from "../../styles/classes";
import { MdCake } from "react-icons/md";
import Modal from "../../structure/Modal";
import BirthdayDetails from "./BirthdayDetails";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/routes";

const BirthdaysView = props => {
    const [friendsCallFlag, setFriendsCallFlag] = useState(false);
    const [birthdayModal, openBirthdayModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (props.auth && props.auth.id && !friendsCallFlag) {
            props.findUserFriendsBirthdays(props.auth.id);
            setFriendsCallFlag(true);
        }
    }, [props, friendsCallFlag]);

    const handleOpenChat = user => {
        navigate(buildUrl(ROUTES.CHAT.path, {id: props.auth.id}), { state: { externalUser: user } });
    }

    const birthdays = getDeepProp(props, 'findUserFriendsResponse.data');

    const getText = () => {
        if (birthdays == null) {
            return null;
        }

        const usersNames = birthdays.map(b => b.friendName);
        let string = '';
        if(usersNames.length > 0) {
            string += usersNames[0];

            if (usersNames.length > 1) {
                string += ` and ${usersNames.length - 1} others have them birthday today.`
            } else {
                string += ' has its birthday today.';
            }
        }

        return string;
    }

    const modal = (
        <Modal
            handleClose={() => openBirthdayModal(false)}
            flag={birthdayModal}
        >
            <BirthdayDetails
                birthdayList={birthdays}
                handleOpenChat={handleOpenChat}
            />
        </Modal>
    )

    return (
        <React.Fragment>
            <div className={ClassNames.BIRTHDAYS_VIEW}>
                <h4>Today's Birthdays</h4>
                {birthdays && birthdays.length > 0 
                ? <div className={ClassNames.BIRTHDAYS_DIV}>
                        <button className={ClassNames.INVISIBLE_BTN + ' icon'} onClick={() => openBirthdayModal(true)}><MdCake/></button>
                        <span className="text">{getText()}</span>
                    </div>
                : <span className={ClassNames.NO_BIRTHDAYS}>No friend has birthday today.</span>}
            </div>
            {birthdayModal && modal}
        </React.Fragment>
    )
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    findUserFriendsResponse: selectApiState(state, FRIENDS_ROUTES.FIND_USER_FRIENDS_BIRTHDAYS.name),
});

const mapDispatchToProps = (dispatch) => ({
    findUserFriendsBirthdays: () => dispatch(findUserFriendsBirthdays()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BirthdaysView);