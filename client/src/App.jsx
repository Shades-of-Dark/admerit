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
import { EditProfilePage } from "./pages/EditProfilePage";
import { PageSpinner } from "./components/Spinner";
import { ThemeProvider } from "./context/ThemeContext";
import { ThemeToggle } from "./components/themeToggle";
function AuthGate() {
    const { user, loading } = useAuth();
    const [mode, setMode] = useState("login");

    if (loading) return <PageSpinner className="py-16" />;

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
                            <Route path="/users/:userId/edit" element={<EditProfilePage />} />
                        </Routes>
                    </main>
                    <aside className="sticky top-6 hidden w-72 shrink-0 lg:block">
                        <SuggestedUsers />
                    </aside>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            <div className="absolute right-4 top-4">
                <ThemeToggle />
            </div>
            {mode === "login" ? (
                <LoginForm onSwitchToSignup={() => setMode("signup")} />
            ) : (
                <SignupForm onSwitchToLogin={() => setMode("login")} />
            )}
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <AuthGate />
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
