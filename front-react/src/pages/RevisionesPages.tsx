import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/Revisiones.css";
import ExpedienteCard from "./ExpedienteCard";

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

  if (loading) return <p style={{ color: "#fff" }}>Cargando...</p>;

  return (
    <div className="revisiones-page">
      <h1>Revisiones</h1>
      <p>Selecciona un expediente para revisarlo.</p>

      <div className="revisiones-list">
        {expedientes.map((exp) => (
          <ExpedienteCard
            key={exp.id}
            id={exp.id}
            titulo={exp.titulo}
            descripcion={exp.descripcion}
            estado={exp.estado}
          />
        ))}
      </div>
    </div>
  );
}

