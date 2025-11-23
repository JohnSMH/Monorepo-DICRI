import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import LoginRedirect from "./components/LoginRedirect";

import LoginPage from "./pages/Login";
import NotAuthorized from "./pages/NotAuthorized";

// Placeholder pages
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import ExpedientesPage from "./pages/ExpedientesPage";
import RevisionesPage from "./pages/RevisionesPages";
import EvidenciasPage from "./pages/EvidenciasPage";
import RevisionPage from "./pages/RevisionPage";
import ReportsPage from "./pages/ReportsPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          {/* Public */}
          <Route path="/login" element={
            <LoginRedirect>
              <LoginPage />
            </LoginRedirect>
            } />
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
              <ProtectedRoute>
                  <RoleRoute allowed={["coordinador", "admin"]}>
                  <RevisionesPage />
                  </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/revisiones/:expedienteId"
            element={
              <ProtectedRoute>
                <RoleRoute allowed={["coordinador", "admin"]}>
                <RevisionPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/expedientes/:id/evidencias"
            element={
              <ProtectedRoute>
                <RoleRoute allowed={["tecnico", "admin"]}>
                <EvidenciasPage />
                </RoleRoute>
              </ProtectedRoute>
              
            }
          />

          <Route
            path="/reportes"
            element={
              <ProtectedRoute>
                <RoleRoute allowed={["admin","coordinador"]}>
                <ReportsPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

