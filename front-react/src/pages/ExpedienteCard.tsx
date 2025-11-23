import { Link } from "react-router-dom";

interface Props {
  id: number;
  titulo: string;
  descripcion: string;
  estado: string;
}

export default function ExpedienteCard({ id, titulo, descripcion, estado }: Props) {
  const isReviewed = estado === "aprobado" || estado === "rechazado";

  return (
    <div className="expediente-card">
      <p><b>{titulo}</b></p>
      <p>{descripcion}</p>

      {isReviewed ? (
        <button className="expediente-btn disabled" disabled>
          Revisado ({estado})
        </button>
      ) : (
        <Link to={`/revisiones/${id}`} className="expediente-link">
          <button className="expediente-btn">Revisar</button>
        </Link>
      )}
    </div>
  );
}
