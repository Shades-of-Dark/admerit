import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FieldError, FormAlert } from "./FormFeedback";
import { fieldInputClasses } from "../utils/formStyles";

export function LoginForm({ onSwitchToSignup }) {
    const { login, guestLogin } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [guestSubmitting, setGuestSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setFieldErrors({});
        setFormError(null);
        setSubmitting(true);
        try {
            await login(username, password);
        } catch (err) {
            if (err.fieldErrors) setFieldErrors(err.fieldErrors);
            else setFormError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    async function handleGuestLogin() {
        setFormError(null);
        setGuestSubmitting(true);
        try {
            await guestLogin();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setGuestSubmitting(false);
        }
    }

    return (
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <h2>Log In</h2>

            <div className="form-field">
                <label htmlFor="login-username">Username or Email</label>
                <input
                    id="login-username"
                    className={fieldInputClasses(!!fieldErrors.username)}
                    aria-invalid={!!fieldErrors.username}
                    aria-describedby={fieldErrors.username ? "login-username-error" : undefined}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                />
                {fieldErrors.username && <FieldError id="login-username-error">{fieldErrors.username}</FieldError>}
            </div>

            <div className="form-field">
                <label htmlFor="login-password">Password</label>
                <input
                    id="login-password"
                    type="password"
                    className={fieldInputClasses(!!fieldErrors.password)}
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? "login-password-error" : undefined}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {fieldErrors.password && <FieldError id="login-password-error">{fieldErrors.password}</FieldError>}
            </div>

            <FormAlert>{formError}</FormAlert>
            <a href="http://localhost:3000/auth/github" className="oauth-button">
                Continue with GitHub
            </a>
            <button type="submit" disabled={submitting}>
                {submitting ? "Logging in..." : "Log In"}
            </button>

            <button
                type="button"
                onClick={handleGuestLogin}
                disabled={guestSubmitting}
                className="rounded-md border border-(--border) bg-transparent py-2.5 text-(--text-h) transition-opacity hover:opacity-80 disabled:cursor-default disabled:opacity-60"
            >
                {guestSubmitting ? "Signing in..." : "Continue as Guest"}
            </button>

            {onSwitchToSignup && (
                <p className="auth-switch">
                    Don't have an account?{" "}
                    <button type="button" onClick={onSwitchToSignup}>Sign up</button>
                </p>
            )}
        </form>
    );
}
