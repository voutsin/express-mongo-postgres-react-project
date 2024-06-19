import React from "react";
import { Outlet } from "react-router-dom"
import Footer from "./Footer";

const Layout = () => {
    return (
        <React.Fragment>
            <h3 className="website-title">Social Media Layout</h3>
            <Outlet />
            <Footer/>
        </React.Fragment>
    )
}

export default Layout;