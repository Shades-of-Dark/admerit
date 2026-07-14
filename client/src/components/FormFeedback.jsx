// Shared error presentation so client-side validation errors look the same
// everywhere a form renders them, matching the server's { error } / { errors } shape.

export function FieldError({ id, children }) {
    if (!children) return null;
    return (
        <p id={id} role="alert" className="mt-1 text-sm text-[var(--danger)]">
            {children}
        </p>
    );
}

export function FormAlert({ children }) {
    if (!children) return null;
    return (
        <div
            role="alert"
            className="flex items-start gap-2 rounded-md border border-[var(--danger)] bg-[var(--danger-bg)] px-3 py-2 text-sm text-[var(--danger)]"
        >
            <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="mt-0.5 h-4 w-4 shrink-0"
            >
                <path
                    fillRule="evenodd"
                    d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 6Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                    clipRule="evenodd"
                />
            </svg>
            <span>{children}</span>
        </div>
    );
}
