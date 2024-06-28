import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { clearNotify } from "../redux/actions/actions";
import { selectApiState } from "../redux/reducers/apiReducer";
import { Button } from "./Form";
import { isObjectEmpty } from "../common/utils";
import { MdClose } from "react-icons/md";
import { ClassNames } from "../styles/classes";

const Notification = props => {
    const {
        notification
    } = props;

    const activeNotification = notification && !isObjectEmpty(notification);

    useEffect(() => {
        console.log("notification: ", props.notification)
        if (activeNotification) {
            // after 10 seconds close notification
            setTimeout(() => {
                props.clearNotifications();
            }, 10000);
        }
    }, [activeNotification, props])

    const handleClose = () => {
        props.clearNotifications();
    }

    return (
        <React.Fragment>
            <div className={`${ClassNames.NOTIFICATION_WRAPPER} ${activeNotification ? notification.type + ' active' : ''}`}>
                <div>
                    <span>{activeNotification && notification.message}</span>
                    <Button className={ClassNames.MODAL_CLOSE_BTN} onClick={handleClose}>
                        <MdClose/>
                    </Button>
                </div>
            </div>
        </React.Fragment>
    )
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