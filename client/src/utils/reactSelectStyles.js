// react-select renders via inline styles, so it can't read our CSS custom
// properties directly — mirror the theme.css token values here per mode.
const PALETTE = {
    light: {
        text: "#4a453e",
        textH: "#1f1b16",
        textMuted: "#8b8378",
        bg: "#faf7f2",
        bgElevated: "#ffffff",
        border: "#e5ddd0",
        accent: "#b8860b",
        accentContrast: "#ffffff",
        danger: "#b3261e",
    },
    dark: {
        text: "#c9cdd4",
        textH: "#f2f3f5",
        textMuted: "#7c8494",
        bg: "#14181f",
        bgElevated: "#1c212b",
        border: "#2c3340",
        accent: "#d4a017",
        accentContrast: "#14181f",
        danger: "#e5847d",
    },
};

export function majorSelectStyles(hasError, theme = "light") {
    const c = PALETTE[theme] || PALETTE.light;
    return {
        control: (base, state) => ({
            ...base,
            minHeight: "40px",
            borderRadius: "6px",
            backgroundColor: c.bgElevated,
            borderColor: hasError ? c.danger : state.isFocused ? c.accent : c.border,
            boxShadow: state.isFocused
                ? `0 0 0 1px ${hasError ? c.danger : c.accent}`
                : "none",
            "&:hover": {
                borderColor: hasError ? c.danger : c.accent,
            },
        }),
        singleValue: (base) => ({
            ...base,
            color: c.textH,
        }),
        input: (base) => ({
            ...base,
            color: c.textH,
        }),
        placeholder: (base) => ({
            ...base,
            color: c.textMuted,
        }),
        menu: (base) => ({
            ...base,
            zIndex: 20,
            backgroundColor: c.bgElevated,
            border: `1px solid ${c.border}`,
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? c.accent
                : state.isFocused
                ? c.bg
                : c.bgElevated,
            color: state.isSelected ? c.accentContrast : c.textH,
            cursor: "pointer",
        }),
    };
}
