import axios from "axios"


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

// Attach token from localStorage to every request via Authorization header
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export async function register({ username, email, password }) {
    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        })
        if (response.data.token) {
            localStorage.setItem("token", response.data.token)
        }
        return response.data
    } catch (err) {
        const message = err.response?.data?.message || "Registration failed. Please try again."
        throw new Error(message)
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post("/api/auth/login", {
            email, password
        })
        if (response.data.token) {
            localStorage.setItem("token", response.data.token)
        }
        return response.data
    } catch (err) {
        const message = err.response?.data?.message || "Login failed. Please try again."
        throw new Error(message)
    }
}

export async function guestLogin() {
    try {
        const response = await api.get("/api/auth/guest")
        if (response.data.token) {
            localStorage.setItem("token", response.data.token)
        }
        return response.data
    } catch (err) {
        const message = err.response?.data?.message || "Failed to sign in as guest."
        throw new Error(message)
    }
}

export async function logout() {
    try {
        const response = await api.get("/api/auth/logout")
        localStorage.removeItem("token")
        return response.data
    } catch (err) {
        localStorage.removeItem("token")
        const message = err.response?.data?.message || "Logout failed."
        throw new Error(message)
    }
}

export async function getMe() {
    try {
        const response = await api.get("/api/auth/get-me")
        return response.data
    } catch (err) {
        throw new Error("Not authenticated")
    }
}