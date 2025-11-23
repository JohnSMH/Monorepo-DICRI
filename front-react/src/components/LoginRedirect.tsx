import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function LoginRedirect({ children }: { children: any }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;
  return children;
}
