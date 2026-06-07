import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function EmptyState({ title = "No encontramos eventos para mostrar", message = "Cuando haya eventos visibles y vigentes en Bucaramanga, aparecerán aquí." }) {
    return (_jsxs("section", { className: "state-card state-card--empty", role: "status", "aria-live": "polite", children: [_jsx("div", { className: "empty-state-illustration", "aria-hidden": "true", children: _jsx("span", { className: "empty-state-illustration__icon", children: "\u2315" }) }), _jsxs("div", { className: "state-card__copy", children: [_jsx("h3", { children: title }), _jsx("p", { children: message })] })] }));
}
//# sourceMappingURL=EmptyState.js.map