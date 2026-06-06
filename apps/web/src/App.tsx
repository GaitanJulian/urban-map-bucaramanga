import { Routes, Route } from "react-router-dom";
import { DiscoveryPage } from "./pages/DiscoveryPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DiscoveryPage />} />
    </Routes>
  );
}
