import React from "react";
import { useParams } from "react-router-dom";
import ProfileWrapper from "./ProfileWrapper";

const UserProfile = props => {
    const {id} = useParams();

    return (
        <React.Fragment>
            <ProfileWrapper id={id} key={id}/>
        </React.Fragment>
    )
}

export default UserProfile;