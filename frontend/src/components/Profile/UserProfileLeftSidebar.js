import React from "react";
import UserPhotos from "./Photos/UserPhotos";
import UserFriends from "./Friends/UserFriends";

const UserProfileLeftSidebar = props => {
    const { userId } = props;

    return (
        <React.Fragment>
            <div className="user-sidebar-wrapper">
                <div><UserPhotos userId={userId}/></div>
                <div><UserFriends userId={userId}/></div>
            </div>
        </React.Fragment>
    )
}

export default UserProfileLeftSidebar;