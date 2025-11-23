import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

interface Expediente {
  id: number;
  nombre: string;
  descripcion: string;
  estado: string;
}

export default function Expedientes() {
  const { user } = useAuth();

  const [data, setData] = useState<Expediente[]>([]);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    estado: "", // solo lectura
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const navigate = useNavigate();

  //
  // Load all
  //
  const load = async () => {
    const res = await api.get("/expedientes");

    const mapped = res.data.map((x: any) => ({
      id: x.id,
      nombre: x.titulo,
      descripcion: x.descripcion,
      estado: x.estado, // mantener estado
    }));

    setData(mapped);
  };

  //
  // Create / Update
  //
  const save = async () => {
    if (!user) return;

    const base = {
      titulo: form.nombre,
      descripcion: form.descripcion,
      tecnico_id: user.id,
    };

    if (editingId) {
      // UPDATE → enviar estado tal como vino
      await api.put(`/expedientes/${editingId}`, {
        ...base,
        estado: form.estado,
      });
    } else {
      // CREATE → NO enviar estado (backend lo crea)
      await api.post("/expedientes", base);
    }

    setForm({ nombre: "", descripcion: "", estado: "" });
    setEditingId(null);
    load();
  };

  //
  // Delete
  //
  const remove = async (id: number) => {
    await api.delete(`/expedientes/${id}`);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Expedientes</h2>

      <input
        placeholder="Nombre"
        value={form.nombre}
        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
      />

      <input
        placeholder="Descripción"
        value={form.descripcion}
        onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
      />

      {/* Estado solo visible cuando se edita */}
      {editingId && (
        <input
          value={form.estado}
          disabled
          style={{ opacity: 0.6 }}
        />
      )}

      <button onClick={save}>
        {editingId ? "Actualizar" : "Crear"}
      </button>

      <ul>
        {data.map((x) => (
          <li key={x.id}>
            <b>{x.nombre}</b> — {x.descripcion} —  
            <i>Estado: {x.estado}</i>

            <button
              onClick={() => {
                setEditingId(x.id);
                setForm({
                  nombre: x.nombre,
                  descripcion: x.descripcion,
                  estado: x.estado, // solo lectura
                });
              }}
            >
              Editar
            </button>
            
            <button onClick={() => navigate(`/expedientes/${x.id}/evidencias`)}>
              Ver evidencias
            </button>

            <button onClick={() => remove(x.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}