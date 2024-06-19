import React from 'react';
import { connect } from 'react-redux';
import ROUTES from '../config/routes';
import { useNavigate } from 'react-router-dom';

const Menu = props => {
    const loginOk = props.auth && props.auth.authSuccess;
    const navigate = useNavigate();

    const handleClick = route => {
        route && navigate(route.path);
    }

    return(
        <React.Fragment>
            <div className="nav">
                {loginOk && 
                    <button id="home" onClick={() => handleClick(ROUTES.BASE)}>Home</button>
                }
                <button id="logout" onClick={() => handleClick(ROUTES.LOGIN)}>Logout</button>
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