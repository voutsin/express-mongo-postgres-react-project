import React from "react";
import { ClassNames } from "../../styles/classes";
import { MdFace, MdSend } from "react-icons/md";
import { BASE_URL } from "../../config/apiRoutes";

const BirthdayDetails = props => {

    const {
        birthdayList
    } = props

    const handleMessageFriend = info => {
        // TODO: open chat modal
    }

    const itemsList = birthdayList && birthdayList.map(item => {
        const today = new Date();
        const birthDate = new Date(item.friendBirthDate);
        const friendAge = today.getFullYear() - birthDate.getFullYear();;
        const friendsSince = item.friendsSince;

        return (
            <div className={ClassNames.BIRTHDAY_ITEM}>
                <div className={ClassNames.THUMBNAIL_IMG}>
                    {item.friendPicThumbnail ? 
                        <img 
                            src={`${BASE_URL}/${item.friendPicThumbnail}`} 
                            alt={item.friendUsername}
                        /> 
                        : <MdFace/> 
                    }
                </div>
                <div className="friend-info">
                    <span className={'user-name'}>{item.friendName}</span>
                    <span className={'user-age'}>Age: {friendAge}</span>
                    <span className={'friends-time'}>Friends Since: {friendsSince}</span>
                </div>
                <button className="message-icon" onClick={() => handleMessageFriend(item)}><MdSend/></button>
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