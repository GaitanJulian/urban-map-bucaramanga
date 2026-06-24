import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { WorkspaceShell } from "../workspaces/WorkspaceShell";
const ROLE_LABELS = {
    organizer: "Organizador",
    moderator: "Moderador",
    admin: "Administrador"
};
const ROLES = ["organizer", "moderator", "admin"];
export function LoginPage() {
    return (_jsx(WorkspaceShell, { title: "Acceso Release 2", description: "Acceso m\u00EDnimo para organizadores y moderadores autenticados.", role: "admin", children: _jsxs("section", { className: "workspace-card workspace-card--login", "aria-label": "Login m\u00EDnimo", children: [_jsxs("div", { className: "workspace-card__copy", children: [_jsx("h2", { children: "Ingreso protegido" }), _jsx("p", { children: "Este espacio es un punto de partida de Release 2. La autenticaci\u00F3n completa se conectar\u00E1 en un siguiente slice; por ahora no valida credenciales reales." })] }), _jsxs("form", { className: "workspace-form", onSubmit: (event) => event.preventDefault(), children: [_jsxs("label", { className: "workspace-field", children: [_jsx("span", { children: "Email" }), _jsx("input", { type: "email", placeholder: "organizer@urbanmap.local", "aria-label": "Email" })] }), _jsxs("label", { className: "workspace-field", children: [_jsx("span", { children: "Rol" }), _jsx("select", { "aria-label": "Rol", children: ROLES.map((role) => (_jsx("option", { value: role, children: ROLE_LABELS[role] }, role))) })] }), _jsx("button", { type: "submit", className: "workspace-button workspace-button--primary", children: "Entrar" })] })] }) }));
}
//# sourceMappingURL=LoginPage.js.map