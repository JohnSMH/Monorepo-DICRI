import { createContext, useState, useContext } from "react";

//
// --- Types ---
//
export interface User {
  id: number;
  username: string;
  role: "admin" | "tecnico" | "coordinador";
}

export interface AuthData {
  user: User;
  token: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: AuthData) => void;
  logout: () => void;
}

//
// --- Context ---
//
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//
// --- Provider ---
//
export function AuthProvider({ children }: { children: any }) {
  const stored = localStorage.getItem("auth");
  const initialAuth: AuthData | null = stored ? JSON.parse(stored) : null;

  const [user, setUser] = useState<User | null>(initialAuth?.user || null);
  const [token, setToken] = useState<string | null>(initialAuth?.token || null);

  const login = (data: AuthData) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("auth", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

//
// --- Hook ---
//
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return ctx;
}
