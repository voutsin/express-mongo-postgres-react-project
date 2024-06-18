import axios from 'axios';

export const ApiTypes = {
    POST: axios.post,
    PUT: axios.put,
    GET: axios.get,
    DELETE: axios.delete,
}