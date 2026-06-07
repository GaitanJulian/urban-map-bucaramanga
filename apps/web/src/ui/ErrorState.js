import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function ErrorState({ title = "No pudimos cargar los eventos", message, onRetry }) {
    return (_jsxs("section", { className: "state-card state-card--error", role: "alert", children: [_jsx("div", { className: "error-illustration", "aria-hidden": "true", children: _jsx("span", { className: "error-illustration__icon", children: "\u2301" }) }), _jsxs("div", { className: "state-card__copy", children: [_jsx("h3", { children: title }), _jsx("p", { children: message })] }), _jsx("div", { className: "state-card__actions", children: _jsx("button", { type: "button", className: "button button--primary", onClick: onRetry, children: "Reintentar" }) })] }));
}
//# sourceMappingURL=ErrorState.js.map