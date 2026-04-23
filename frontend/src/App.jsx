import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import ProtectedRoute from "./auth/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import PublicArticleDetail from "./pages/PublicArticleDetail";
import PublicHome from "./pages/PublicHome";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<PublicHome />} />
      <Route path="/noticia/:slug" element={<PublicArticleDetail />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
