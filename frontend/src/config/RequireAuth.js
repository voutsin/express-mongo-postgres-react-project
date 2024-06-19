import { useLocation, Navigate, Outlet } from "react-router-dom"
import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import Menu from "../structure/Menu";
import { setUserTokens, verifyUser } from "../redux/actions/actions";
import { isObjectEmpty } from "../common/utils";

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
        // Show a loading indicator or placeholder while verification is in progress
        return <div>Loading...</div>;
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
});

const mapDispatchToProps = (dispatch) => ({
    setUserTokens: data => dispatch(setUserTokens(data)),
    verifyUser: () => dispatch(verifyUser()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RequireAuth);