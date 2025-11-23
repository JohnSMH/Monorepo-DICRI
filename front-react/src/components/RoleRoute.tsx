import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import type { JSX } from "react";

interface Props {
  children: JSX.Element;
  allowed: Array<"admin" | "tecnico" | "coordinador">;
}

export default function RoleRoute({ children, allowed }: Props) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (!allowed.includes(user.role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
}
