export function majorSelectStyles(hasError) {
    return {
        control: (base, state) => ({
            ...base,
            minHeight: "40px",
            borderRadius: "6px",
            borderColor: hasError ? "#dc2626" : state.isFocused ? "#111827" : "#ccc",
            boxShadow: state.isFocused
                ? `0 0 0 1px ${hasError ? "#dc2626" : "#111827"}`
                : "none",
            "&:hover": {
                borderColor: hasError ? "#dc2626" : "#999",
            },
        }),
        placeholder: (base) => ({
            ...base,
            color: "#9ca3af",
        }),
        menu: (base) => ({
            ...base,
            zIndex: 20,
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? "#111827"
                : state.isFocused
                ? "#f3f4f6"
                : "white",
            color: state.isSelected ? "white" : "#111827",
            cursor: "pointer",
        }),
    };
}