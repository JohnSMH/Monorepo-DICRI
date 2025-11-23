import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import "../styles/Revisiones.css";

export default function ReviewPage() {
  const navigate = useNavigate();
  const { expedienteId } = useParams();
  const { user } = useAuth();

  const [expediente, setExpediente] = useState<any>(null);
  const [evidencias, setEvidencias] = useState<any[]>([]);
  const [justificacion, setJustificacion] = useState("");
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p style={{ color: "#fff" }}>Cargando...</p>;
  if (!expediente) return <p style={{ color: "#fff" }}>No existe este expediente.</p>;

  const aprobar = async () => {
    await api.post("/reviews", {
      expediente_id: Number(expedienteId),
      coordinador_id: user?.id,
      estado: "aprobado",
      justificacion: null,
    });
    alert("Expediente aprobado");
    navigate("/revisiones");
  };

  const rechazar = async () => {
    if (!justificacion.trim()) { alert("Debes escribir una justificación"); return; }
    await api.post("/reviews", {
      expediente_id: Number(expedienteId),
      coordinador_id: user?.id,
      estado: "rechazado",
      justificacion,
    });
    alert("Expediente rechazado");
    navigate("/revisiones");
  };

  return (
    <div className="revisiones-page">
      <div className="expediente-card">
        <h2>Expediente #{expediente.id}</h2>
        <p><b>Título:</b> {expediente.titulo}</p>
        <p><b>Descripción:</b> {expediente.descripcion}</p>
        <p><b>Estado:</b> {expediente.estado}</p>
      </div>

      <h3>Evidencias</h3>
      {evidencias.map((ev) => (
        <div key={ev.id} className="expediente-card">
          <p><b>{ev.nombre_objeto}</b> — {ev.descripcion}</p>
          <p>Color: {ev.color} | Tamaño: {ev.tamano} | Peso: {ev.peso}</p>
          <p>Ubicación: {ev.ubicacion}</p>
        </div>
      ))}

      <div className="review-actions">
        <button onClick={aprobar} className="approve-btn">✔ Aprobar</button>
        <div>
          <textarea
            className="justificacion-textarea"
            placeholder="Justificación al rechazar"
            value={justificacion}
            onChange={(e) => setJustificacion(e.target.value)}
          />
          <button onClick={rechazar} className="reject-btn">✖ Rechazar</button>
        </div>
      </div>
    </div>
  );
}