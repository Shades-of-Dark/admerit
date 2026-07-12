import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FieldError, FormAlert } from "./FormFeedback";
import { fieldInputClasses } from "../utils/formStyles";
import '../styles/logincompanybranding.css';
// Keep this in sync with PASSWORD_MESSAGE in server/validators/userValidators.js
const PASSWORD_MESSAGE = "Password must be 8-72 characters";

export function SignupForm({ onSwitchToLogin }) {
    const { signup } = useAuth();
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        intendedMajor: "",
        bio: "",
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    function updateField(field) {
        return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
    }

    function validateClientSide() {
        const errors = {};
        if (form.password.length < 8 || form.password.length > 72) {
            errors.password = PASSWORD_MESSAGE;
        }
        if (form.confirmPassword !== form.password) {
            errors.confirmPassword = "Passwords must match";
        }
        return errors;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setFormError(null);

        const clientErrors = validateClientSide();
        if (Object.keys(clientErrors).length > 0) {
            setFieldErrors(clientErrors);
            return;
        }

        setFieldErrors({});
        setSubmitting(true);
        try {
            const { confirmPassword, ...signupData } = form;
            await signup(signupData);
        } catch (err) {
            if (err.fieldErrors) setFieldErrors(err.fieldErrors);
            else setFormError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <h2>Sign Up</h2>

            <div className="form-field">
                <label htmlFor="signup-username">Username</label>
                <input
                    id="signup-username"
                    className={fieldInputClasses(!!fieldErrors.username)}
                    aria-invalid={!!fieldErrors.username}
                    aria-describedby={fieldErrors.username ? "signup-username-error" : undefined}
                    value={form.username}
                    onChange={updateField("username")}
                />
                {fieldErrors.username && <FieldError id="signup-username-error">{fieldErrors.username}</FieldError>}
            </div>

            <div className="form-field">
                <label htmlFor="signup-email">Email</label>
                <input
                    id="signup-email"
                    type="email"
                    className={fieldInputClasses(!!fieldErrors.email)}
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? "signup-email-error" : undefined}
                    value={form.email}
                    onChange={updateField("email")}
                />
                {fieldErrors.email && <FieldError id="signup-email-error">{fieldErrors.email}</FieldError>}
            </div>

            <div className="form-field">
                <label htmlFor="signup-password">Password</label>
                <input
                    id="signup-password"
                    type="password"
                    className={fieldInputClasses(!!fieldErrors.password)}
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? "signup-password-error" : undefined}
                    value={form.password}
                    onChange={updateField("password")}
                />
                {fieldErrors.password && <FieldError id="signup-password-error">{fieldErrors.password}</FieldError>}
            </div>

            <div className="form-field">
                <label htmlFor="signup-confirm-password">Confirm Password</label>
                <input
                    id="signup-confirm-password"
                    type="password"
                    className={fieldInputClasses(!!fieldErrors.confirmPassword)}
                    aria-invalid={!!fieldErrors.confirmPassword}
                    aria-describedby={fieldErrors.confirmPassword ? "signup-confirm-password-error" : undefined}
                    value={form.confirmPassword}
                    onChange={updateField("confirmPassword")}
                />
                {fieldErrors.confirmPassword && (
                    <FieldError id="signup-confirm-password-error">{fieldErrors.confirmPassword}</FieldError>
                )}
            </div>

            <div className="form-field">
                <label htmlFor="signup-intended-major">Intended Major (optional)</label>
                <input
                    id="signup-intended-major"
                    className={fieldInputClasses(!!fieldErrors.intendedMajor)}
                    aria-invalid={!!fieldErrors.intendedMajor}
                    aria-describedby={fieldErrors.intendedMajor ? "signup-intended-major-error" : undefined}
                    value={form.intendedMajor}
                    onChange={updateField("intendedMajor")}
                />
                {fieldErrors.intendedMajor && (
                    <FieldError id="signup-intended-major-error">{fieldErrors.intendedMajor}</FieldError>
                )}
            </div>

            <div className="form-field">
                <label htmlFor="signup-bio">Bio (optional)</label>
                <textarea
                    id="signup-bio"
                    rows={3}
                    className={fieldInputClasses(!!fieldErrors.bio)}
                    aria-invalid={!!fieldErrors.bio}
                    aria-describedby={fieldErrors.bio ? "signup-bio-error" : undefined}
                    value={form.bio}
                    onChange={updateField("bio")}
                />
                {fieldErrors.bio && <FieldError id="signup-bio-error">{fieldErrors.bio}</FieldError>}
            </div>

            <FormAlert>{formError}</FormAlert>

            <button type="submit" disabled={submitting}>
                {submitting ? "Signing up..." : "Sign Up"}
            </button>
            <a href="http://localhost:3000/auth/github" className="oauth-button">
                Continue with GitHub
            </a>
            <a href="http://localhost:3000/auth/google" className="gsi-material-button" style={{ width: "220px" }}>
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                    <div className="gsi-material-button-icon">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: "block" }}>
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                            <path fill="none" d="M0 0h48v48H0z"></path>
                        </svg>
                    </div>
                    <span className="gsi-material-button-contents">Sign up with Google</span>
                </div>
            </a>
            {onSwitchToLogin && (
                <p className="auth-switch">
                    Already have an account?{" "}
                    <button type="button" onClick={onSwitchToLogin}>Log in</button>
                </p>
            )}
        </form>
    );
}
