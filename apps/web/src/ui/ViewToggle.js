import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function ViewToggle({ value, onChange }) {
    return (_jsxs("div", { className: "view-toggle", role: "tablist", "aria-label": "Cambiar vista", children: [_jsx("button", { type: "button", className: value === "map" ? "view-toggle__button is-active" : "view-toggle__button", onClick: () => onChange("map"), role: "tab", "aria-selected": value === "map", children: "Mapa" }), _jsx("button", { type: "button", className: value === "list" ? "view-toggle__button is-active" : "view-toggle__button", onClick: () => onChange("list"), role: "tab", "aria-selected": value === "list", children: "Lista" })] }));
}
//# sourceMappingURL=ViewToggle.js.map