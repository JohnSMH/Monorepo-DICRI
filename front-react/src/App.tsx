import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import LoginPage from "./pages/Login";
import NotAuthorized from "./pages/NotAuthorized";

// Placeholder pages
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import ExpedientesPage from "./pages/ExpedientesPage";
import RevisionesPage from "./pages/RevisionesPages";
import EvidenciasPage from "./pages/EvidenciasPage";
import RevisionPage from "./pages/RevisionPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/not-authorized" element={<NotAuthorized />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Role-based routes */}
          <Route
            path="/admin"
            element={
              <RoleRoute allowed={["admin"]}>
                <AdminPanel />
              </RoleRoute>
            }
          />

          <Route
            path="/expedientes"
            element={
              <ProtectedRoute>
                <RoleRoute allowed={["tecnico", "admin"]}>
                  <ExpedientesPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/revisiones"
            element={
              <RoleRoute allowed={["coordinador", "admin"]}>
                <RevisionesPage />
              </RoleRoute>
            }
          />

          <Route
            path="/revisiones/:expedienteId"
            element={
              <RoleRoute allowed={["coordinador", "admin"]}>
                <RevisionPage />
              </RoleRoute>
            }
          />

          <Route
            path="/expedientes/:id/evidencias"
            element={
              <RoleRoute allowed={["tecnico", "admin"]}>
                <EvidenciasPage />
              </RoleRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

