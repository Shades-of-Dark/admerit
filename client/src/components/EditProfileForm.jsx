import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { updateUser } from "../api/users";
import { FieldError, FormAlert } from "./FormFeedback";
import { fieldInputClasses } from "../utils/formStyles";
import { majorSelectStyles } from "../utils/reactSelectStyles";
import { MAJORS } from "../data/majors";
import { Spinner } from "./Spinner";

const MAJOR_OPTIONS = MAJORS.map((major) => ({ value: major, label: major }));
const PASSWORD_MESSAGE = "Password must be 8-72 characters";

export function EditProfileForm({ profile }) {
    const { user, setUser } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: profile.username || "",
        email: profile.email || "",
        intendedMajor: profile.intendedMajor || "",
        bio: profile.bio || "",
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [wantsPasswordChange, setWantsPasswordChange] = useState(false);

    function updateField(field) {
        return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
    }

    function validateClientSide() {
        const errors = {};

        if (form.username.trim().length < 3 || form.username.trim().length > 20) {
            errors.username = "Username must be 3-20 characters";
        }
        if (!form.email.includes("@")) {
            errors.email = "Enter a valid email";
        }
        if (form.bio.length > 300) {
            errors.bio = "Bio must be under 300 characters";
        }

        if (wantsPasswordChange) {
            if (!form.currentPassword) {
                errors.currentPassword = "Enter your current password";
            }
            if (form.newPassword.length < 8 || form.newPassword.length > 72) {
                errors.newPassword = PASSWORD_MESSAGE;
            }
            if (form.newPassword !== form.confirmNewPassword) {
                errors.confirmNewPassword = "Passwords must match";
            }
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
            const payload = {
                username: form.username,
                email: form.email,
                intendedMajor: form.intendedMajor,
                bio: form.bio,
            };
            if (wantsPasswordChange) {
                payload.currentPassword = form.currentPassword;
                payload.newPassword = form.newPassword;
            }

            const updated = await updateUser(profile.id, payload);
            setUser((prev) => ({ ...prev, ...updated }));
            navigate(`/users/${profile.id}`);
        } catch (err) {
            if (err.fieldErrors) setFieldErrors(err.fieldErrors);
            else setFormError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <h2>Edit Profile</h2>

            <div className="form-field">
                <label htmlFor="edit-username">Username</label>
                <input
                    id="edit-username"
                    className={fieldInputClasses(!!fieldErrors.username)}
                    aria-invalid={!!fieldErrors.username}
                    aria-describedby={fieldErrors.username ? "edit-username-error" : undefined}
                    value={form.username}
                    onChange={updateField("username")}
                />
                {fieldErrors.username && <FieldError id="edit-username-error">{fieldErrors.username}</FieldError>}
            </div>

            <div className="form-field">
                <label htmlFor="edit-email">Email</label>
                <input
                    id="edit-email"
                    type="email"
                    className={fieldInputClasses(!!fieldErrors.email)}
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? "edit-email-error" : undefined}
                    value={form.email}
                    onChange={updateField("email")}
                />
                {fieldErrors.email && <FieldError id="edit-email-error">{fieldErrors.email}</FieldError>}
            </div>

            <div className="form-field">
                <label htmlFor="edit-intended-major">Intended Major</label>
                <Select
                    inputId="edit-intended-major"
                    options={MAJOR_OPTIONS}
                    value={MAJOR_OPTIONS.find((opt) => opt.value === form.intendedMajor) || null}
                    onChange={(selected) =>
                        setForm((prev) => ({ ...prev, intendedMajor: selected ? selected.value : "" }))
                    }
                    placeholder="Search for a major..."
                    isClearable
                    styles={majorSelectStyles(!!fieldErrors.intendedMajor, theme)}
                />
                {fieldErrors.intendedMajor && (
                    <FieldError id="edit-intended-major-error">{fieldErrors.intendedMajor}</FieldError>
                )}
            </div>

            <div className="form-field">
                <label htmlFor="edit-bio">Bio</label>
                <textarea
                    id="edit-bio"
                    rows={3}
                    className={fieldInputClasses(!!fieldErrors.bio)}
                    aria-invalid={!!fieldErrors.bio}
                    aria-describedby={fieldErrors.bio ? "edit-bio-error" : undefined}
                    value={form.bio}
                    onChange={updateField("bio")}
                />
                {fieldErrors.bio && <FieldError id="edit-bio-error">{fieldErrors.bio}</FieldError>}
            </div>

            {!wantsPasswordChange && (
                <button
                    type="button"
                    className="text-left text-[13px] text-[var(--accent)] underline"
                    onClick={() => setWantsPasswordChange(true)}
                >
                    Change password
                </button>
            )}

            {wantsPasswordChange && (
                <>
                    <div className="form-field">
                        <label htmlFor="edit-current-password">Current Password</label>
                        <input
                            id="edit-current-password"
                            type="password"
                            className={fieldInputClasses(!!fieldErrors.currentPassword)}
                            aria-invalid={!!fieldErrors.currentPassword}
                            value={form.currentPassword}
                            onChange={updateField("currentPassword")}
                        />
                        {fieldErrors.currentPassword && (
                            <FieldError id="edit-current-password-error">{fieldErrors.currentPassword}</FieldError>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="edit-new-password">New Password</label>
                        <input
                            id="edit-new-password"
                            type="password"
                            className={fieldInputClasses(!!fieldErrors.newPassword)}
                            aria-invalid={!!fieldErrors.newPassword}
                            value={form.newPassword}
                            onChange={updateField("newPassword")}
                        />
                        {fieldErrors.newPassword && (
                            <FieldError id="edit-new-password-error">{fieldErrors.newPassword}</FieldError>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="edit-confirm-new-password">Confirm New Password</label>
                        <input
                            id="edit-confirm-new-password"
                            type="password"
                            className={fieldInputClasses(!!fieldErrors.confirmNewPassword)}
                            aria-invalid={!!fieldErrors.confirmNewPassword}
                            value={form.confirmNewPassword}
                            onChange={updateField("confirmNewPassword")}
                        />
                        {fieldErrors.confirmNewPassword && (
                            <FieldError id="edit-confirm-new-password-error">{fieldErrors.confirmNewPassword}</FieldError>
                        )}
                    </div>

                    <button
                        type="button"
                        className="text-left text-[13px] text-[var(--text)] underline"
                        onClick={() => {
                            setWantsPasswordChange(false);
                            setForm((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmNewPassword: "" }));
                        }}
                    >
                        Cancel password change
                    </button>
                </>
            )}

            <FormAlert>{formError}</FormAlert>

            <button type="submit" disabled={submitting} className="inline-flex items-center justify-center gap-2">
                {submitting && <Spinner size={16} />}
                {submitting ? "Saving..." : "Save Changes"}
            </button>
        </form>
    );
}