import Login from "../components/Auth/Login"
import Register from "../components/Auth/Register";
import ChatPage from "../components/Chat/ChatPage";
import Home from "../components/Home/Home";
import Post from "../components/Post/Post";
import UserProfile from "../components/Profile/UserProfile";
import SearchPage from "../components/Search/SearchPage";

export const PUBLIC_ROUTES = {
    LOGIN: {
        path: '/login',
        component: Login
    },
    REGISTER: {
        path: '/register',
        component: Register
    },
}
export const ROUTES = {
    BASE: {
        path: '/',
        component: Home
    },
    SEARCH: {
        path: '/search',
        component: SearchPage
    },
    PROFILE: {
        path: '/profile/:id',
        component: UserProfile
    },
    CHAT: {
        path: '/chat/:id',
        component: ChatPage
    },
    POST: {
        path: '/post/:id',
        component: Post
    },
}