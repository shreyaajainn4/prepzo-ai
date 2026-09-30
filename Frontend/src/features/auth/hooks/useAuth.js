import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, guestLogin } from "../services/auth.api";



export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context


    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            setUser(data.user)
            return { success: true }
        } catch (err) {
            return { success: false, error: err.message }
        } finally {
            setLoading(false)
        }
    }

    const handleGuestLogin = async () => {
        setLoading(true)
        try {
            const data = await guestLogin()
            setUser(data.user)
            return { success: true }
        } catch (err) {
            return { success: false, error: err.message }
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
            return { success: true }
        } catch (err) {
            return { success: false, error: err.message }
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            const data = await logout()
            setUser(null)
        } catch (err) {
            localStorage.removeItem("token")
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    return { user, loading, handleRegister, handleLogin, handleLogout, handleGuestLogin }
}