import { io } from 'socket.io-client';
import { BASE_URL } from './apiRoutes';
import Cookies from 'js-cookie';

export const socket = query => {
    return io(BASE_URL, {
        withCredentials: true,
        query,
        auth: {
            accessToken: Cookies.get('accessToken'),
            refreshToken: Cookies.get('refreshToken'),
        }
    });
};