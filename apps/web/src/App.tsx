import { Navigate, Route, Routes } from "react-router-dom";
import { DiscoveryPage } from "./pages/DiscoveryPage";
import { LoginPage } from "./pages/LoginPage";
import { OrganizerWorkspacePage } from "./pages/OrganizerWorkspacePage";
import { ModerationWorkspacePage } from "./pages/ModerationWorkspacePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DiscoveryPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/organizer" element={<OrganizerWorkspacePage />} />
      <Route path="/moderation" element={<ModerationWorkspacePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
