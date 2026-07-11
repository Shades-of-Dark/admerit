// Tailwind classes to append to an input/textarea's className depending on
// whether that field currently has a validation error.
export function fieldInputClasses(hasError) {
    return hasError
        ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 outline-none"
        : "";
}
