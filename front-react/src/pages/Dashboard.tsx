import "../styles/Dashboard.css";
import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null; // safety check

  return (
    <div className="dashboard-page">
      <h2>Dashboard</h2>

      <div className="dashboard-cards">
        {/* Expedientes card - visible for admin and tecnico */}
        {(user.role === "admin" || user.role === "tecnico") && (
          <div className="dashboard-card">
            <h3>Expedientes</h3>
            <p>Ver registros y detalles.</p>
            <Link to="/expedientes">
              <button>Ir a Expedientes</button>
            </Link>
          </div>
        )}

        {/* Revisiones card - visible for admin and coordinador */}
        {(user.role === "admin" || user.role === "coordinador") && (
          <div className="dashboard-card">
            <h3>Revisiones</h3>
            <p>Ver aprobaciones y rechazos.</p>
            <Link to="/revisiones">
              <button>Ir a Revisiones</button>
            </Link>
          </div>
        )}

        {/* Reporting card - visible only for admin and coord */}
        {(user.role === "admin" || user.role === "coordinador") && (
          <div className="dashboard-card">
            <h3>Reportes</h3>
            <p>Generar reportes sobre registros, aprobaciones y rechazos.</p>
            <Link to="/reportes">
              <button>Ir a Reportes</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}