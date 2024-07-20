import React, { useEffect, useState } from "react";
import { ClassNames } from "../../styles/classes";
import { connect } from "react-redux";
import { selectNotificationList, selectNotificationPage } from "../../redux/reducers/notificationReducer";
import { clearNotificationData, getNotifications, markReadNotifications } from "../../redux/actions/actions";
import Loader from "../../structure/Loader";
import NotificationItem from "./NotificationItem";

const Notifications = props => {
    const [notifications, setNotifications] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState({page: 1, pageSize: 5});

    const { getUserNotifications, notificationList, notificationPage, clearData, markUserNotificationsRead } = props;

    useEffect(() => {
        getUserNotifications(page.page, page.pageSize);
        markUserNotificationsRead();

        return () => {
            clearData();
        }
    }, []);

    useEffect(() => {
        if (notificationList && JSON.stringify(notificationList) !== JSON.stringify(notifications) && notificationPage) {
            setNotifications(notificationList);
            setPage({
                ...page,
                page: notificationPage.page,
            });
            setLoading(false);
        }
    }, [notifications, notificationList, notificationPage, page]);

    const handleLoadMore = () => {
        if (notificationPage.totalPages > page.page) {
            const newPage = page.page + 1;
            getUserNotifications(newPage, page.pageSize);
        }
    }

    if (loading) {
        return (
            <div className={ClassNames.NOT_WRAPPER}>
                <Loader mini={true}/>
            </div>
        )
    }

    return (
        <React.Fragment>
            <div className={ClassNames.NOT_WRAPPER}>
                {notifications 
                    ? <div className={ClassNames.NOTIFICATIONS_LIST}>
                            {notifications.map((not, index) => {
                                return (
                                    <NotificationItem key={`notification-${index}`} notification={not}/>
                                )
                            })}
                            {notificationPage.totalPages > page.page
                                ? <div className="load-more">
                                    <span onClick={handleLoadMore}>load more</span>
                                </div>
                                : null
                            }
                        </div>
                    : <p>No notifications yet.</p>
                }
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    notificationList: selectNotificationList(state),
    notificationPage: selectNotificationPage(state),
});

const mapDispatchToProps = dispatch => ({
    getUserNotifications: (page, pageSize) => dispatch(getNotifications(page, pageSize)),
    markUserNotificationsRead: () => dispatch(markReadNotifications()),
    clearData: () => dispatch(clearNotificationData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);