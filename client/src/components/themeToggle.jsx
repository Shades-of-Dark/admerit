import { useTheme } from "../context/ThemeContext";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-full border border-[var(--border)] p-2 text-[var(--text)] hover:bg-[var(--bg-elevated)] transition-colors"
        >
            {theme === "light" ? "🌙" : "☀️"}
        </button>
    );
}