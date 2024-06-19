import axios from 'axios';

export const ApiTypes = {
    POST: axios.post,
    PUT: axios.put,
    GET: axios.get,
    DELETE: axios.delete,
}

export const NotifyTypes = {
    ERROR: 'error',
    WARNING: 'warning',
    SUCCESS: 'success'
}