import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoginForm } from "./components/LoginForm";
import { SignupForm } from "./components/SignupForm";
import { Feed } from "./pages/Feed";
import { PostDetail } from "./pages/PostDetail";

function AuthGate() {
    const { user, loading, logout } = useAuth();
    const [mode, setMode] = useState("login");

    if (loading) return <p>Loading...</p>;

    if (user) {
        return (
            <div>
                <header className="app-header">
                    <span>Welcome, {user.username}</span>
                    <button type="button" onClick={logout}>Log Out</button>
                </header>
                <Routes>
                    <Route path="/" element={<Feed />} />
                    <Route path="/posts/:postId" element={<PostDetail />} />
                </Routes>
            </div>
        );
    }

    return mode === "login" ? (
        <LoginForm onSwitchToSignup={() => setMode("signup")} />
    ) : (
        <SignupForm onSwitchToLogin={() => setMode("login")} />
    );
}

function App() {
    return (
        <AuthProvider>
            <AuthGate />
        </AuthProvider>
    );
}

export default App;
