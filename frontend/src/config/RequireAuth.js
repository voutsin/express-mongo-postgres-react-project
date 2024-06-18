import { useLocation, Navigate, Outlet } from "react-router-dom"
import React from "react";
import Menu from "../structure/Menu";
import { useSelector } from "react-redux";
import { selectUserState } from "../redux/reducers/authReducer";

const RequireAuth = () => {
    const location = useLocation();
    const user = useSelector(selectUserState);
    const loginOk = user && user.authSuccess;

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
export default RequireAuth