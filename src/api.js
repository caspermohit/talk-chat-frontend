import axios from 'axios';
const api = axios.create({
    
    baseURL: `${import.meta.env.VITE_API_URL}`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});
export function setAuthToken(token) {
    if (token) {
        api.defaults.headers.common['authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['authorization'];
    }
}



export default api;
