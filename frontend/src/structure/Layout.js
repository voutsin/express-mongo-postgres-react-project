import React from "react";
import { Outlet } from "react-router-dom"
import Notification from "./Notification";

const Layout = () => {
    return (
        <React.Fragment>
            <Notification/>
            <Outlet />
        </React.Fragment>
    )
}

export default Layout;