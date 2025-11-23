import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import "../styles/ExpedientesPage.css";

interface Expediente {
  id: number;
  nombre: string;
  descripcion: string;
  estado: string;
}

export default function Expedientes() {
  const { user } = useAuth();
  const [data, setData] = useState<Expediente[]>([]);
  const [form, setForm] = useState({ nombre: "", descripcion: "", estado: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false); // collapsible
  const navigate = useNavigate();

  const load = async () => {
    const res = await api.get("/expedientes");
    const mapped = res.data.map((x: any) => ({
      id: x.id,
      nombre: x.titulo,
      descripcion: x.descripcion,
      estado: x.estado,
    }));
    setData(mapped);
  };

  const save = async () => {
    if (!user) return;
    const base = { titulo: form.nombre, descripcion: form.descripcion, tecnico_id: user.id };
    if (editingId) await api.put(`/expedientes/${editingId}`, { ...base, estado: form.estado });
    else await api.post("/expedientes", base);
    setForm({ nombre: "", descripcion: "", estado: "" });
    setEditingId(null);
    setShowForm(false);
    load();
  };

  const remove = async (id: number) => { await api.delete(`/expedientes/${id}`); load(); };

  useEffect(() => { load(); }, []);

  const startEditing = (x: Expediente) => {
    setEditingId(x.id);
    setForm({ nombre: x.nombre, descripcion: x.descripcion, estado: x.estado });
    setShowForm(true);
  };

  return (
    <div className="expedientes-page">
      <h2>Expedientes</h2>

      {/* Toggle button */}
      <button 
        onClick={() => { 
          setShowForm(!showForm); 
          setEditingId(null); 
          setForm({ nombre: "", descripcion: "", estado: "" });
        }}
        style={{ marginBottom: "20px", padding: "10px 16px", borderRadius: "8px", border: "none", cursor: "pointer", backgroundColor: "#ffffff", color: "#0b2545", fontSize: "16px" }}
      >
        {showForm ? "Ocultar Formulario" : "Agregar Expediente"}
      </button>

      {/* Collapsible form card */}
      <div className={`expedientes-form-card ${showForm ? "" : "collapsed"}`}>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (!form.nombre.trim() || !form.descripcion.trim()) return;
          save();
        }}>
          <input 
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
          />
          <input
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            required
          />

          {editingId && (
            <input type="hidden" value={form.estado} />
          )}

          <button type="submit">{editingId ? "Actualizar" : "Crear"}</button>
        </form>
      </div>

      {/* List of expediente cards */}
      <div className="expedientes-list">
        {data.map((x) => {
          const isFinal = x.estado === "aprobado" || x.estado === "rechazado";

          return (
            <div key={x.id} className="expediente-card">
              <b>{x.nombre}</b>
              <p>{x.descripcion}</p>
              <span className={`expediente-status status-${x.estado}`}>
                {x.estado.replace("_", " ")}
              </span>

              <button 
                onClick={() => startEditing(x)} 
                className={isFinal ? "disabled" : ""}
              >
                Editar
              </button>
              <button 
                onClick={() => navigate(`/expedientes/${x.id}/evidencias`)} 
                className={isFinal ? "disabled" : ""}
              >
                Ver evidencias
              </button>
              <button 
                onClick={() => remove(x.id)} 
                className={isFinal ? "disabled" : ""}
              >
                Eliminar
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}