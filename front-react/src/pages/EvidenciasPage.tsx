import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/authContext";

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
  const { id } = useParams(); // expediente_id desde URL
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

  //
  // Load evidencias del expediente
  //
  const load = async () => {
    const res = await api.get(`/evidencias/expediente/${expedienteId}`);
    setData(res.data);
  };

  //
  // Save
  //
  const save = async () => {
    if (!user) return;

    const payload = {
      expediente_id: expedienteId,   // fijo del URL
      nombre_objeto: form.nombre_objeto,
      descripcion: form.descripcion,
      color: form.color,
      tamano: form.tamano,
      peso: form.peso,
      ubicacion: form.ubicacion,
      tecnico_id: user.id,
    };

    if (editingId) {
      await api.put(`/evidencias/${editingId}`, payload);
    } else {
      await api.post("/evidencias", payload);
    }

    setForm({
      nombre_objeto: "",
      descripcion: "",
      color: "",
      tamano: "",
      peso: "",
      ubicacion: "",
    });

    setEditingId(null);
    load();
  };

  //
  // Delete
  //
  const remove = async (id: number) => {
    await api.delete(`/evidencias/${id}`);
    load();
  };

  useEffect(() => {
    load();
  }, [id]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Evidencias del expediente #{expedienteId}</h2>

      <input
        placeholder="Nombre del objeto"
        value={form.nombre_objeto}
        onChange={(e) => setForm({ ...form, nombre_objeto: e.target.value })}
      />

      <input
        placeholder="Descripción"
        value={form.descripcion}
        onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
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

      <button onClick={save}>
        {editingId ? "Actualizar" : "Agregar evidencia"}
      </button>

      <ul>
        {data.map((x) => (
          <li key={x.id}>
            <b>{x.nombre_objeto}</b> — {x.descripcion}  
            ({x.color}, {x.tamano}, {x.peso}, {x.ubicacion})

            <div>
              Registrado: {new Date(x.fecha_registro).toLocaleString()}
            </div>

            <button
              onClick={() => {
                setEditingId(x.id);
                setForm({
                  nombre_objeto: x.nombre_objeto,
                  descripcion: x.descripcion,
                  color: x.color,
                  tamano: x.tamano,
                  peso: x.peso,
                  ubicacion: x.ubicacion,
                });
              }}
            >
              Editar
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

