import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
export function ProtectedRoute({ role, children }) {
    const { status, actor } = useAuth();
    const location = useLocation();
    if (status === "loading") {
        return _jsx("div", { className: "workspace-placeholder", children: "Verificando sesi\u00F3n..." });
    }
    if (status === "unauthenticated") {
        return (_jsx(Navigate, { to: "/login", replace: true, state: { reason: "unauthenticated", from: location.pathname } }));
    }
    if (actor?.activeRole !== role) {
        return (_jsx(Navigate, { to: "/login", replace: true, state: { reason: "forbidden", from: location.pathname } }));
    }
    return _jsx(_Fragment, { children: children });
}
//# sourceMappingURL=ProtectedRoute.js.map