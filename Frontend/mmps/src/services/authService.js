import { axiosInstance } from "@/axiosConfig"

// services/authService.js
const login = async (email, password) => {
    const response = await axiosInstance.post(`/auth/login`, { email, password })
    console.log(response)
    return response.data
}

const signup = async (email, password, name) => {
    const response = await axiosInstance.post(`/auth/signup`, { email, password, name })
    return response.data
}

const validateFace = async (faceDescriptor, email) => {
    const response = await axiosInstance.post('/auth/validate-face', {
        email,
        faceDescriptor
    })
    return response.data
}

export default {
    login,
    signup,
    validateFace
}
