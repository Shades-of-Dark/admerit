// Tailwind classes to append to an input/textarea's className depending on
// whether that field currently has a validation error.
export function fieldInputClasses(hasError) {
    return hasError
        ? "border-[var(--danger)] focus:border-[var(--danger)] focus:ring-2 focus:ring-[var(--danger)] outline-none"
        : "";
}
