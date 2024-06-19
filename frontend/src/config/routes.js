import Home from "../structure/Home";
import Login from "../components/Auth/Login"
import Register from "../components/Auth/Register";

const ROUTES = {
    BASE: {
        path: '/',
        component: Home
    },
    LOGIN: {
        path: '/login',
        component: Login
    },
    REGISTER: {
        path: '/register',
        component: Register
    },
}

export default ROUTES;