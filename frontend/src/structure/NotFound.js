import React from "react";
import { ClassNames } from "../styles/classes";

const NotFound = props => {
    const { text } = props;

    return (
        <React.Fragment>
            <div className={ClassNames.NOT_FOUND}>
                <h4>{text}</h4>
            </div>
        </React.Fragment>
    )
}

export default NotFound;