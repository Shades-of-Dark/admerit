import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoginForm } from "./components/LoginForm";
import { SignupForm } from "./components/SignupForm";
import { NavBar } from "./components/NavBar";
import { SuggestedUsers } from "./components/SuggestedUsers";
import { Feed } from "./pages/Feed";
import { PostDetail } from "./pages/PostDetail";
import { UsersIndex } from "./pages/UsersIndex";
import { Profile } from "./pages/Profile";

function AuthGate() {
    const { user, loading } = useAuth();
    const [mode, setMode] = useState("login");

    if (loading) return <p className="py-8 text-center text-[var(--text)]">Loading...</p>;

    if (user) {
        return (
            <div>
                <NavBar />
                <div className="mx-auto flex w-full max-w-[1360px] items-start gap-8 px-6 py-6">
                    <main className="min-w-0 flex-1 text-left">
                        <Routes>
                            <Route path="/" element={<Feed />} />
                            <Route path="/posts/:postId" element={<PostDetail />} />
                            <Route path="/users" element={<UsersIndex />} />
                            <Route path="/users/:userId" element={<Profile />} />
                        </Routes>
                    </main>
                    <aside className="sticky top-6 hidden w-72 shrink-0 lg:block">
                        <SuggestedUsers />
                    </aside>
                </div>
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
