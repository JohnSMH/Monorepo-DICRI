import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import "../styles/Dashboard.css";

export default function Menu() {
  const { logout } = useAuth();

  return (
    <nav className="dashboard-menu">
      <div className="menu-left">
        <Link to="/">Inicio</Link>
        <Link to="/expedientes">Expedientes</Link>
        <Link to="/revisiones">Revisiones</Link>
      </div>
      <div className="menu-right">
        <button onClick={logout}>Cerrar Sesión</button>
      </div>
    </nav>
  );
}