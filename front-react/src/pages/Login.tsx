import { useState } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://127.0.0.1:3001/api/auth/login", {
        username,
        password,
      });

      login(res.data); // { user, token }
      navigate("/");
    } catch (err) {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f4f4",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "8px",
          width: "320px",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Iniciar Sesión</h2>

        {error && (
          <div style={{ color: "red", textAlign: "center", fontSize: "0.9rem" }}>
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "0.8rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "0.8rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
          required
        />

        <button
          type="submit"
          style={{
            padding: "0.8rem",
            borderRadius: "6px",
            border: "none",
            background: "#2d6cdf",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
