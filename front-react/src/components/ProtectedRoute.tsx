import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import type { JSX } from "react";
import Menu from "./Menu";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Menu />
      {children}
    </div>
  );
}

