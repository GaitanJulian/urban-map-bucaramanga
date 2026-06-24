import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { DiscoveryPage } from "./pages/DiscoveryPage";
import { LoginPage } from "./pages/LoginPage";
import { OrganizerWorkspacePage } from "./pages/OrganizerWorkspacePage";
import { ModerationWorkspacePage } from "./pages/ModerationWorkspacePage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<DiscoveryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/organizer"
          element={
            <ProtectedRoute role="organizer">
              <OrganizerWorkspacePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/moderation"
          element={
            <ProtectedRoute role="moderator">
              <ModerationWorkspacePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
