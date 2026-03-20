import axios from "axios";
import { clearToken, getToken } from './storage'

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// intercept responses to handle 401 errors (unauthorized)
api.interceptors.request.use((config) => { // Add the token to the Authorization header if it exists
    const token = getToken();
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
});

api.interceptors.response.use(
    (response) => response, // Just return the response if it's successful
    (error) => {
        if (error?.response && error?.response?.status === 401) { // If we get a 401 response, clear the token
            clearToken();
        }
        return Promise.reject(error); // Reject the promise with the error
    }
)

export default api;