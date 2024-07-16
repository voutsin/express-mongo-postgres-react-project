import { useLocation, Navigate, Outlet } from "react-router-dom"
import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import Menu from "../structure/Menu";
import { verifyUser } from "../redux/actions/actions";
import { getDeepProp, isObjectEmpty } from "../common/utils";
import Loader from "../structure/Loader";

const RequireAuth = props => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                await props.verifyUser();
            } catch (error) {
                console.error("Error verifying user:", error);
                setLoading(false);
            } 
        }

        if (isObjectEmpty(props.auth)) {
            verifyUser();
        } else {
            setLoading(false); // If auth data is already available, no need to verify
        }

    }, [props])

    const loginOk = props.auth && props.auth.authSuccess;

    if (loading) {
        const errorStatus = getDeepProp(props, 'api.error.status');
        if (!errorStatus) {
            // Show a loading indicator or placeholder while verification is in progress
            return <Loader mini={true}/>;
        }
    }

    return (
        loginOk
            ? <React.Fragment>
                <Menu/>
                <div className="body-wrapper">
                    <Outlet />
                </div>
            </React.Fragment>
            : <Navigate to="/login" state={{ from: location }} replace />
    )
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    api: state.api,
});

const mapDispatchToProps = (dispatch) => ({
    verifyUser: () => dispatch(verifyUser()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RequireAuth);