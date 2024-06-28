import React from 'react';
import { connect } from 'react-redux';
import { ROUTES, PUBLIC_ROUTES } from '../config/routes';
import { useNavigate } from 'react-router-dom';
import { Input } from './Form';
import { MdLogout, MdSearch, MdChat, MdNotifications, MdFace } from 'react-icons/md';
import { BASE_URL } from '../config/apiRoutes';
import { ClassNames } from '../styles/classes';
import NexGenLogoSVG from '../styles/images/logo';

const Menu = props => {
    const loginOk = props.auth && props.auth.authSuccess;
    const navigate = useNavigate();

    const handleClick = route => {
        route && navigate(route.path);
    }

    const handleOpenNotifications = () => {

    }

    const profilePicUrl = props.auth && props.auth.profilePictureThumb;
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
                        <Input type={'text'} />
                        <button id="search" onClick={() => handleClick(ROUTES.SEARCH)}><MdSearch/></button>
                    </div>
                </div>
                 
                <div className={`${ClassNames.NAV_SECTION} ${ClassNames.NAV_UPDATES}`}>
                    {loginOk &&
                        <div className={`${ClassNames.NAV_ITEM}`}>
                            <button id="chat" onClick={() => handleClick(ROUTES.CHAT)}><MdChat /></button>
                        </div>
                    }
                    {loginOk &&
                        <div className={`${ClassNames.NAV_ITEM}`}>
                            <button id="notifications" onClick={handleOpenNotifications}><MdNotifications /></button>
                            <div className={ClassNames.NOT_WRAPPER}>
                            </div>
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
});

export default connect(
    mapStateToProps,
    null
)(Menu);