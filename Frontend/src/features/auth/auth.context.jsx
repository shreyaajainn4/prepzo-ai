import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api";


export const AuthContext = createContext()


export const AuthProvider = ({ children }) => { 

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Centralized auth check — runs once on app mount
    // Only calls API if a token exists in localStorage
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            setLoading(false)
            return
        }

        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
            } catch (err) {
                // Token is invalid/expired — clean up
                localStorage.removeItem("token")
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        getAndSetUser()
    }, [])


    return (
        <AuthContext.Provider value={{user,setUser,loading,setLoading}} >
            {children}
        </AuthContext.Provider>
    )

    
}