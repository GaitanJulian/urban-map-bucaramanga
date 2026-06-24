import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { DiscoveryPage } from "./pages/DiscoveryPage";
import { LoginPage } from "./pages/LoginPage";
import { OrganizerWorkspacePage } from "./pages/OrganizerWorkspacePage";
import { ModerationWorkspacePage } from "./pages/ModerationWorkspacePage";
export default function App() {
    return (_jsx(AuthProvider, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(DiscoveryPage, {}) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/organizer", element: _jsx(ProtectedRoute, { role: "organizer", children: _jsx(OrganizerWorkspacePage, {}) }) }), _jsx(Route, { path: "/moderation", element: _jsx(ProtectedRoute, { role: "moderator", children: _jsx(ModerationWorkspacePage, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }));
}
//# sourceMappingURL=App.js.map