import React from "react";
import { Outlet } from "react-router-dom"
import Footer from "./Footer";
import Notification from "./Notification";

const Layout = () => {
    return (
        <React.Fragment>
            <Notification/>
            <h3 className="website-title">Social Media Layout</h3>
            <Outlet />
            <Footer/>
        </React.Fragment>
    )
}

export default Layout;