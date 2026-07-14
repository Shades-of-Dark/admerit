import { createContext, useContext, useState, useEffect } from "react";
import { getSession, login as loginApi, logout as logoutApi, signup as signupApi, guestLogin as guestLoginApi } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSession()
            .then(({ user }) => setUser(user))
            .catch((err) => console.error("Failed to load session:", err))
            .finally(() => setLoading(false));
    }, []);

    async function login(username, password) {
        const { user } = await loginApi(username, password);
        setUser(user);
    }

    async function signup(userData) {
        const user = await signupApi(userData);
        setUser(user); // auto-login after signup
    }

    async function guestLogin() {
        const { user } = await guestLoginApi();
        setUser(user);
    }

    async function logout() {
        await logoutApi();
        setUser(null);
    }

    async function refreshSession() {
        const { user } = await getSession();
        setUser(user);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, guestLogin, logout, setUser, refreshSession }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}