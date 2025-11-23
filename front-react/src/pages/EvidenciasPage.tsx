import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/authContext";
import "../styles/EvidenciasPage.css";

interface Evidencia {
  id: number;
  expediente_id: number;
  nombre_objeto: string;
  descripcion: string;
  color: string;
  tamano: string;
  peso: string;
  ubicacion: string;
  fecha_registro: string;
}

export default function Evidencias() {
  const { id } = useParams();
  const expedienteId = Number(id);
  const { user } = useAuth();

  const [data, setData] = useState<Evidencia[]>([]);
  const [form, setForm] = useState({
    nombre_objeto: "",
    descripcion: "",
    color: "",
    tamano: "",
    peso: "",
    ubicacion: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const res = await api.get(`/evidencias/expediente/${expedienteId}`);
    setData(res.data);
  };

  const save = async () => {
    if (!user) return;

    // require all fields
    if (!form.nombre_objeto.trim() || !form.descripcion.trim()) return;

    const payload = {
      expediente_id: expedienteId,
      ...form,
      tecnico_id: user.id,
    };

    if (editingId) await api.put(`/evidencias/${editingId}`, payload);
    else await api.post("/evidencias", payload);

    setForm({
      nombre_objeto: "",
      descripcion: "",
      color: "",
      tamano: "",
      peso: "",
      ubicacion: "",
    });
    setEditingId(null);
    setShowForm(false);
    load();
  };

  const remove = async (id: number) => {
    await api.delete(`/evidencias/${id}`);
    load();
  };

  useEffect(() => { load(); }, [id]);

  const startEditing = (x: Evidencia) => {
    setEditingId(x.id);
    setForm({
      nombre_objeto: x.nombre_objeto,
      descripcion: x.descripcion,
      color: x.color,
      tamano: x.tamano,
      peso: x.peso,
      ubicacion: x.ubicacion,
    });
    setShowForm(true);
  };

  return (
    <div className="evidencias-page">
      <h2>Evidencias del expediente #{expedienteId}</h2>

      {/* Toggle button */}
      <button
        onClick={() => { 
          setShowForm(!showForm);
          setEditingId(null);
          setForm({
            nombre_objeto: "",
            descripcion: "",
            color: "",
            tamano: "",
            peso: "",
            ubicacion: "",
          });
        }}
        style={{ marginBottom: "20px", padding: "10px 16px", borderRadius: "8px", border: "none", cursor: "pointer", backgroundColor: "#ffffff", color: "#0b2545", fontSize: "16px" }}
      >
        {showForm ? "Ocultar Formulario" : editingId ? "Editar evidencia" : "Agregar evidencia"}
      </button>

      {/* Collapsible form card */}
      <div className={`evidencias-form-card ${showForm ? "" : "collapsed"}`}>
        <form onSubmit={(e) => {
          e.preventDefault();
          // Ensure required fields are filled
          if (!form.nombre_objeto.trim() || !form.descripcion.trim()) return;
          save();
        }}>
          <input
            placeholder="Nombre del objeto"
            value={form.nombre_objeto}
            onChange={(e) => setForm({ ...form, nombre_objeto: e.target.value })}
            required
          />

          <input
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            required
          />

          <input
            placeholder="Color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
          />

          <input
            placeholder="Tamaño"
            value={form.tamano}
            onChange={(e) => setForm({ ...form, tamano: e.target.value })}
          />

          <input
            placeholder="Peso"
            value={form.peso}
            onChange={(e) => setForm({ ...form, peso: e.target.value })}
          />

          <input
            placeholder="Ubicación"
            value={form.ubicacion}
            onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
          />

          <button type="submit">{editingId ? "Actualizar" : "Agregar evidencia"}</button>
        </form>
      </div>

      {/* List of evidencia cards */}
      <div className="evidencias-list">
        {data.map((x) => (
          <div key={x.id} className="evidencia-card">
            <b>{x.nombre_objeto}</b>
            <p>{x.descripcion}</p>
            <div>({x.color}, {x.tamano}, {x.peso}, {x.ubicacion})</div>
            <div>Registrado: {new Date(x.fecha_registro).toLocaleString()}</div>
            <button onClick={() => startEditing(x)}>Editar</button>
            <button onClick={() => remove(x.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
