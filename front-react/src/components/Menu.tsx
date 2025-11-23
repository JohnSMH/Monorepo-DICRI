import { Link } from "react-router-dom";

export default function Menu() {
  return (
    <>
      <nav style={{ padding: 20 }}>
        <Link to="/expedientes" style={{ marginRight: 10 }}>
          Expedientes
        </Link>
      </nav>
      <nav style={{ padding: 20 }}>
        <Link to="/revisiones" style={{ marginRight: 10 }}>
          Revisiones
        </Link>
      </nav>
    </>
  );
}
