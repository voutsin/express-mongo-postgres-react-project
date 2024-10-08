import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { clearNotify } from "../redux/actions/actions";
import { selectApiState } from "../redux/reducers/apiReducer";
import { Button } from "./Form/Form.js";
import { isObjectEmpty } from "../common/utils";
import { MdClose } from "react-icons/md";
import { ClassNames } from "../styles/classes";

const Notification = props => {
    const {
        notification
    } = props;

    const activeNotification = notification && !isObjectEmpty(notification);

    useEffect(() => {
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
                    <span dangerouslySetInnerHTML={{ __html: activeNotification && notification.message }} />
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