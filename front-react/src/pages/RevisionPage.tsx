import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/authContext";

export default function ReviewPage() {
  const { expedienteId } = useParams();
  const { user } = useAuth();

  const [expediente, setExpediente] = useState<any>(null);
  const [evidencias, setEvidencias] = useState<any[]>([]);
  const [justificacion, setJustificacion] = useState("");
  const [loading, setLoading] = useState(true);

  // Load expediente + evidencias
  useEffect(() => {
    const load = async () => {
      const exp = await api.get(`/expedientes/${expedienteId}`);
      const ev = await api.get(`/evidencias/expediente/${expedienteId}`);

      setExpediente(exp.data);
      setEvidencias(ev.data);
      setLoading(false);
    };

    load();
  }, [expedienteId]);

  if (loading) return <p>Cargando...</p>;
  if (!expediente) return <p>No existe este expediente.</p>;

  // --- Actions ---
const aprobar = async () => {
  await api.post("/reviews", {
    expediente_id: Number(expedienteId),
    coordinador_id: user?.id,
    estado: "aprobado",
    justificacion: null,
  });
  alert("Expediente aprobado");
};

const rechazar = async () => {
  if (!justificacion.trim()) {
    alert("Debes escribir una justificación");
    return;
  }

  await api.post("/reviews", {
    expediente_id: Number(expedienteId),
    coordinador_id: user?.id,
    estado: "rechazado",
    justificacion,
  });

  alert("Expediente rechazado");
};

  return (
    <div style={{ padding: 20 }}>
      <h1>Revisión de Expediente #{expediente.id}</h1>

      {/* --- Expediente info --- */}
      <div style={{ marginTop: 10, marginBottom: 20 }}>
        <p><b>Título:</b> {expediente.titulo}</p>
        <p><b>Descripción:</b> {expediente.descripcion}</p>
        <p><b>Estado:</b> {expediente.estado}</p>
      </div>

      <h2>Evidencias</h2>
      <ul>
        {evidencias.map((ev) => (
          <li key={ev.id}>
            <b>{ev.nombre_objeto}</b> — {ev.descripcion}
            <br />
            Color: {ev.color} | Tamaño: {ev.tamano} | Peso: {ev.peso}
            <br />
            Ubicación: {ev.ubicacion}
          </li>
        ))}
      </ul>

      <hr style={{ marginTop: 20, marginBottom: 20 }} />

      {/* --- Review actions --- */}
      <div>
        <h3>Acciones</h3>

        <button onClick={aprobar} style={{ marginRight: 10 }}>
          ✔ Aprobar
        </button>

        <div style={{ marginTop: 10 }}>
          <textarea
            placeholder="Justificación al rechazar"
            value={justificacion}
            onChange={(e) => setJustificacion(e.target.value)}
            style={{ width: "100%", height: 80 }}
          />
          <button onClick={rechazar} style={{ marginTop: 10 }}>
            ✖ Rechazar
          </button>
        </div>
      </div>
    </div>
  );
}
