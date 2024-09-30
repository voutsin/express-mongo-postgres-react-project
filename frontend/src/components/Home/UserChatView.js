import React from "react";
import { BASE_URL } from "../../config/apiRoutes";
import { MdFace } from "react-icons/md";
import { ClassNames } from "../../styles/classes";

const UserChatView = props => {

    const {
        userInfo,
        onClick
    } = props;

    const handleClick = () => {
        onClick(userInfo);
    }

    return (
        <React.Fragment>
            <div className={'friend'} onClick={handleClick}>
                <div className={ClassNames.THUMBNAIL_IMG}>
                    {userInfo.profilePictureThumb ? 
                        <img 
                            src={`${BASE_URL}/${userInfo.profilePictureThumb}`} 
                            alt={userInfo.username}
                        /> 
                        : <MdFace/> 
                    }
                </div>
                <span className={'user-name'}>{userInfo.name}</span>
            </div>
        </React.Fragment>
    )
}

export default UserChatView;