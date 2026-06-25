import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
const ROLE_LABELS = {
    organizer: "Organizador",
    moderator: "Moderador",
    admin: "Administrador"
};
export function WorkspaceShell({ title, description, role, children }) {
    const { status, actor, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };
    return (_jsxs("div", { className: "workspace-shell", children: [_jsxs("header", { className: "workspace-shell__header", children: [_jsxs("div", { children: [_jsx("p", { className: "workspace-shell__eyebrow", children: ROLE_LABELS[role] }), _jsx("h1", { className: "workspace-shell__title", children: title }), _jsx("p", { className: "workspace-shell__description", children: description })] }), _jsxs("nav", { className: "workspace-shell__nav", "aria-label": "Navegaci\u00F3n de workspace", children: [_jsx(Link, { to: "/", className: "workspace-shell__nav-link", children: "Descubrimiento" }), status === "authenticated" && actor ? (_jsxs(_Fragment, { children: [actor.activeRole === "admin" ? (_jsx(Link, { to: "/admin", className: "workspace-shell__nav-link", children: "Panel admin" })) : null, _jsxs("span", { className: "workspace-shell__nav-link", "aria-label": "Cuenta actual", children: [actor.displayName, " (", ROLE_LABELS[actor.activeRole], ")"] }), _jsx("button", { type: "button", className: "workspace-shell__nav-link workspace-shell__logout", onClick: handleLogout, children: "Cerrar sesi\u00F3n" })] })) : (_jsx(Link, { to: "/login", className: "workspace-shell__nav-link", children: "Ingreso" }))] })] }), _jsx("main", { className: "workspace-shell__content", children: children })] }));
}
//# sourceMappingURL=WorkspaceShell.js.map