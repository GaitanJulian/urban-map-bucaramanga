import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { WorkspaceShell } from "../workspaces/WorkspaceShell";
const WORKSPACE_BY_ROLE = {
    organizer: "/organizer",
    moderator: "/moderation",
    admin: "/admin"
};
function readContextualMessage(state) {
    if (!state?.reason) {
        return null;
    }
    if (state.reason === "unauthenticated") {
        return "Tu sesión expiró o no has iniciado sesión. Ingresa de nuevo para continuar.";
    }
    return "No tienes permisos para acceder a esa sección con la cuenta actual.";
}
export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const contextualMessage = readContextualMessage(location.state ?? null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null);
        try {
            const actor = await login(email, password);
            navigate(WORKSPACE_BY_ROLE[actor.activeRole]);
        }
        catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "No pudimos iniciar sesión.");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsx(WorkspaceShell, { title: "Acceso a tu cuenta", description: "Inicia sesi\u00F3n con tu cuenta de organizador, moderador o administrador.", role: "admin", children: _jsxs("section", { className: "workspace-card workspace-card--login", "aria-label": "Ingreso real", children: [_jsxs("div", { className: "workspace-card__copy", children: [_jsx("h2", { children: "Ingreso protegido" }), _jsx("p", { children: "Inicia sesi\u00F3n con tus credenciales reales para acceder al workspace correspondiente a tu rol." })] }), _jsxs("form", { className: "workspace-form", onSubmit: handleSubmit, children: [_jsxs("label", { className: "workspace-field", children: [_jsx("span", { children: "Email" }), _jsx("input", { type: "email", placeholder: "organizer@urbanmap.local", "aria-label": "Email", value: email, onChange: (event) => setEmail(event.target.value), required: true })] }), _jsxs("label", { className: "workspace-field", children: [_jsx("span", { children: "Contrase\u00F1a" }), _jsx("input", { type: "password", placeholder: "Contrase\u00F1a", "aria-label": "Contrase\u00F1a", value: password, onChange: (event) => setPassword(event.target.value), required: true })] }), _jsx("button", { type: "submit", className: "workspace-button workspace-button--primary", disabled: isSubmitting, children: isSubmitting ? "Ingresando..." : "Entrar" }), contextualMessage ? _jsx("p", { className: "workspace-notice workspace-notice--error", children: contextualMessage }) : null, errorMessage ? _jsx("p", { className: "workspace-notice workspace-notice--error", children: errorMessage }) : null] })] }) }));
}
//# sourceMappingURL=LoginPage.js.map