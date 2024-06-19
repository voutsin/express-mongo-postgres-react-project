import React from "react";
import { connect } from 'react-redux';
import { clearNotify } from "../redux/actions/actions";
import { selectApiState } from "../redux/reducers/apiReducer";
import { Button } from "./Form";
import { isObjectEmpty } from "../common/utils";

const Notification = props => {
    const {
        notification
    } = props;

    const handleClose = () => {
        props.clearNotifications();
    }

    return notification && !isObjectEmpty(notification) ? (
        <React.Fragment>
            <div className={`notification-wrapper ${notification.type}`}>
                <span>{notification.message}</span>
                <Button className={'close-btn'} onClick={handleClose}>Close</Button>
            </div>
        </React.Fragment>
    ) : null;
}

const mapStateToProps = (state) => ({
    notification: selectApiState(state, 'notify'),
});

const mapDispatchToProps = (dispatch) => ({
    clearNotifications: () => dispatch(clearNotify()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Notification);