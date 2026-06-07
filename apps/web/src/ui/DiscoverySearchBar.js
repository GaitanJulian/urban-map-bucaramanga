import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function DiscoverySearchBar({ value, onChange, onClear }) {
    const hasValue = value.trim().length > 0;
    return (_jsxs("label", { className: "search-bar", children: [_jsx("span", { className: "search-bar__icon", "aria-hidden": "true", children: "\u2315" }), _jsx("input", { type: "search", value: value, onChange: (event) => onChange(event.target.value), placeholder: "Buscar eventos, lugares...", "aria-label": "Buscar eventos" }), hasValue ? (_jsx("button", { type: "button", className: "search-bar__clear", onClick: onClear, "aria-label": "Limpiar b\u00FAsqueda", children: "\u00D7" })) : null] }));
}
//# sourceMappingURL=DiscoverySearchBar.js.map