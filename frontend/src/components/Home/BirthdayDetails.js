import React from "react";
import { ClassNames } from "../../styles/classes";
import { MdSend } from "react-icons/md";
import UserName from "../../structure/User/UserName";
import UserImage from "../../structure/User/UserImage";

const BirthdayDetails = props => {

    const {
        birthdayList,
        handleOpenChat
    } = props;

    const itemsList = birthdayList && birthdayList.map(item => {
        const today = new Date();
        const birthDate = new Date(item.friendBirthDate);
        const friendAge = today.getFullYear() - birthDate.getFullYear();
        const friendsSince = item.friendsSince;

        return (
            <div className={ClassNames.USER_ITEM}>
                <UserImage
                    id={item.friendId}
                    picUrl={item.friendPicThumbnail}
                    username={item.friendUsername}
                    className={ClassNames.THUMBNAIL_IMG}
                />
                <div className={ClassNames.USER_INFO}>
                    <UserName name={item.friendName} id={item.friendId} />
                    <span className={'user-age'}>Age: {friendAge}</span>
                    <span className={'friends-time'}>Friends Since: {friendsSince}</span>
                </div>
                <button className={ClassNames.MESSAGE_ICON} onClick={() => handleOpenChat(item)}><MdSend/></button>
            </div>
        )
    })

    return (
        <React.Fragment>
            <div className={ClassNames.BIRTHDAYS_DETAILS}>
                <h4>Today's Birthdays</h4>
                {birthdayList && 
                    <div className={ClassNames.BIRTHDAYS_LIST}>
                        {itemsList}
                    </div>
                }
            </div>
        </React.Fragment>
    )
}

export default BirthdayDetails;