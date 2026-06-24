import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
const ROLE_LABELS = {
    organizer: "Organizador",
    moderator: "Moderador",
    admin: "Administrador"
};
export function WorkspaceShell({ title, description, role, children }) {
    return (_jsxs("div", { className: "workspace-shell", children: [_jsxs("header", { className: "workspace-shell__header", children: [_jsxs("div", { children: [_jsx("p", { className: "workspace-shell__eyebrow", children: ROLE_LABELS[role] }), _jsx("h1", { className: "workspace-shell__title", children: title }), _jsx("p", { className: "workspace-shell__description", children: description })] }), _jsxs("nav", { className: "workspace-shell__nav", "aria-label": "Navegaci\u00F3n de workspace", children: [_jsx(Link, { to: "/", className: "workspace-shell__nav-link", children: "Descubrimiento" }), _jsx(Link, { to: "/login", className: "workspace-shell__nav-link", children: "Ingreso" })] })] }), _jsx("main", { className: "workspace-shell__content", children: children })] }));
}
//# sourceMappingURL=WorkspaceShell.js.map