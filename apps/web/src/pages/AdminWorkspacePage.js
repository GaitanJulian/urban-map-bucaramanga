import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminOrganizersApiError, listAdminOrganizers } from "../api/adminOrganizers";
import { StatusBadge } from "../ui/StatusBadge";
import { WorkspaceShell } from "../workspaces/WorkspaceShell";
function readErrorMessage(error, fallback) {
    if (error instanceof AdminOrganizersApiError || error instanceof Error) {
        return error.message;
    }
    return fallback;
}
export function AdminWorkspacePage() {
    const [organizers, setOrganizers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    useEffect(() => {
        let isMounted = true;
        (async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const response = await listAdminOrganizers();
                if (isMounted) {
                    setOrganizers(response);
                }
            }
            catch (error) {
                if (isMounted) {
                    setErrorMessage(readErrorMessage(error, "No pudimos cargar los organizadores."));
                }
            }
            finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        })();
        return () => {
            isMounted = false;
        };
    }, []);
    return (_jsx(WorkspaceShell, { title: "Panel de Administraci\u00F3n", description: "Vista m\u00EDnima para el rol administrador: organizadores curados y accesos r\u00E1pidos.", role: "admin", children: _jsxs("section", { className: "workspace-grid", children: [_jsxs("article", { className: "workspace-card", "aria-label": "Organizadores curados", children: [_jsxs("div", { className: "workspace-card__copy", children: [_jsx("h2", { children: "Organizadores" }), _jsx("p", { children: "Organizadores curados administrados desde Identity & Access." })] }), isLoading ? _jsx("div", { className: "workspace-placeholder", children: "Cargando organizadores..." }) : null, !isLoading && errorMessage ? _jsx("p", { className: "workspace-notice workspace-notice--error", children: errorMessage }) : null, !isLoading && !errorMessage && organizers.length === 0 ? (_jsx("div", { className: "workspace-placeholder", children: "No hay organizadores curados todav\u00EDa." })) : null, !isLoading && !errorMessage && organizers.length > 0 ? (_jsx("div", { className: "draft-list", children: organizers.map((organizer) => (_jsxs("div", { className: "draft-list__item", children: [_jsx("span", { className: "draft-list__title", children: organizer.organizationName }), _jsx(StatusBadge, { value: organizer.verificationState })] }, organizer.organizerId))) })) : null] }), _jsxs("article", { className: "workspace-card", "aria-label": "Accesos r\u00E1pidos", children: [_jsxs("div", { className: "workspace-card__copy", children: [_jsx("h2", { children: "Accesos r\u00E1pidos" }), _jsx("p", { children: "Atajos a los workspaces operativos de Release 2." })] }), _jsxs("div", { className: "draft-list", children: [_jsx(Link, { className: "draft-list__item", to: "/", children: _jsx("span", { className: "draft-list__title", children: "Discovery p\u00FAblico" }) }), _jsx(Link, { className: "draft-list__item", to: "/organizer", children: _jsx("span", { className: "draft-list__title", children: "Organizer Workspace" }) }), _jsx(Link, { className: "draft-list__item", to: "/moderation", children: _jsx("span", { className: "draft-list__title", children: "Moderation Workspace" }) })] })] })] }) }));
}
//# sourceMappingURL=AdminWorkspacePage.js.map