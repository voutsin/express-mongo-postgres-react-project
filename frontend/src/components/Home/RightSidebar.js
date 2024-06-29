import React from "react";
import FriendsColumn from "./FriendsColumn";
import BirthdaysView from "./BirthdaysView";
import { ClassNames } from "../../styles/classes";

const RightSidebar = props => {

    return (
        <React.Fragment>
            <div className={ClassNames.RIGHT_SIDEBAR_WRAPPER}>
                <BirthdaysView/>
                <FriendsColumn/>
            </div>
        </React.Fragment>
    )
}

export default RightSidebar;