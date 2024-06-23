// src/axiosConfig.js
import axios from 'axios'

const baseURL = import.meta.env.VITE_APP_BASE_URL
const adminBaseURL = import.meta.env.VITE_APP_ADMIN_BASE_URL


const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
})

const axiosAdminInstance = axios.create({
    baseURL: adminBaseURL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// axiosInstance.interceptors.request.use(
//     (config) => {
//         if (token.value) {
//             config.headers.Authorization = `Bearer ${token.value}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

export { axiosInstance, axiosAdminInstance }
