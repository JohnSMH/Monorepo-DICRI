import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

export default function ReviewsListPage() {
  const [expedientes, setExpedientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/expedientes");
      setExpedientes(res.data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <p>Cargando...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Revisiones</h1>
      <p>Selecciona un expediente para revisarlo.</p>

      <ul>
        {expedientes.map((exp) => (
          <li key={exp.id} style={{ marginBottom: 10 }}>
            <b>{exp.titulo}</b> – {exp.descripcion}

            {" "}
            <Link to={`/revisiones/${exp.id}`} style={{ marginLeft: 10 }}>
              Revisar
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
