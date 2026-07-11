import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FieldError, FormAlert } from "./FormFeedback";
import { fieldInputClasses } from "../utils/formStyles";

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

            {onSwitchToLogin && (
                <p className="auth-switch">
                    Already have an account?{" "}
                    <button type="button" onClick={onSwitchToLogin}>Log in</button>
                </p>
            )}
        </form>
    );
}
