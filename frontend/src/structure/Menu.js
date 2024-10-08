import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ROUTES, PUBLIC_ROUTES } from '../config/routes';
import { useNavigate } from 'react-router-dom';
import { MdLogout, MdSearch, MdChat, MdNotifications, MdFace } from 'react-icons/md';
import { BASE_URL } from '../config/apiRoutes';
import { ClassNames } from '../styles/classes';
import NexGenLogoSVG from '../styles/images/logo';
import { buildUrl, removeEmptyFields } from '../common/utils';
import TextInput from './Form/TextInput';
import { selectUnreadCount } from '../redux/reducers/chatReducer';
import Notifications from '../components/Notifications/Notifications';
import { selectNotificationUnreadList } from '../redux/reducers/notificationReducer';
import { getUnreadNotifications } from '../redux/actions/actions';

const Menu = props => {
    const [inputs, setInputs] = useState({});
    const [openNotifications, setNotificationModal] = useState(false);
    const { auth, unreadCount, notificationUnreadList, getUnreadNotificationsList } = props;

    const loginOk = auth && auth.authSuccess;
    const navigate = useNavigate();

    useEffect(() => {
        getUnreadNotificationsList();
    }, []);

    const handleClick = route => {
        route && navigate(buildUrl(route.path, { id: auth.id }));
    }

    const toggleNotifications = () => setNotificationModal(!openNotifications)

    const handleSearch = route => {
        const finalBody = removeEmptyFields(inputs);
        if(finalBody != null && finalBody.searchText != null && route) {
            navigate(route.path, { state: { searchText: finalBody.searchText } })
        }
    }

    const handleChange = (name, value) => {
        setInputs({
            ...inputs,
            [name]: value,
        })
    }

    const profilePicUrl = auth && auth.profilePictureThumb;
    return(
        <React.Fragment>
            <div id={'nav'} className={ClassNames.NAV}>
                <div className={`${ClassNames.NAV_SECTION} ${ClassNames.NAV_LOGO}`}>
                    <a href={ROUTES.BASE.path}>
                        <NexGenLogoSVG/>
                    </a>
                </div>
                <div className={`${ClassNames.NAV_SECTION} ${ClassNames.NAV_SEARCH}`}>
                    <div className={`${ClassNames.NAV_ITEM}`}>
                        <TextInput type="text" name='searchText' onChange={handleChange} formData={inputs} />
                        <button id="search" onClick={() => handleSearch(ROUTES.SEARCH)}><MdSearch/></button>
                    </div>
                </div>
                 
                <div className={`${ClassNames.NAV_SECTION} ${ClassNames.NAV_UPDATES}`}>
                    {loginOk &&
                        <div className={`${ClassNames.NAV_ITEM}`}>
                            {unreadCount && unreadCount > 0 ? 
                                <span className={ClassNames.UNREAD_MESSAGES}>{unreadCount}</span> : null
                            }
                            <button id="chat" onClick={() => handleClick(ROUTES.CHAT)}><MdChat /></button>
                        </div>
                    }
                    {loginOk &&
                        <div className={`${ClassNames.NAV_ITEM}`}>
                            {notificationUnreadList && notificationUnreadList.length > 0 ? 
                                <span className={ClassNames.UNREAD_MESSAGES}>{notificationUnreadList.length}</span> : null
                            }
                            <button id="notifications" onClick={toggleNotifications}><MdNotifications /></button>
                            {openNotifications ? <Notifications/> : null}
                        </div>
                    }
                    {loginOk && 
                        <div className={`${ClassNames.NAV_ITEM} account`}>
                            <button id="account" onClick={() => handleClick(ROUTES.PROFILE)}>
                                {profilePicUrl ? <img src={`${BASE_URL}/${profilePicUrl}`} alt={''} className={`${ClassNames.NAV_ACCOUNT_PIC}`} /> : <MdFace/> }
                            </button>
                        </div>
                    }
                    <div className={`${ClassNames.NAV_ITEM}`}>
                        <button id="logout" onClick={() => handleClick(PUBLIC_ROUTES.LOGIN)}><MdLogout/></button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    unreadCount: selectUnreadCount(state),
    notificationUnreadList: selectNotificationUnreadList(state),
});

const mapDispatchToProps = dispatch => ({
    getUnreadNotificationsList: () => dispatch(getUnreadNotifications()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Menu);