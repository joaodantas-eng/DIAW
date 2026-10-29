import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

// Sem usuário logado, volta para o login
export default function ProtectedRoute({ children }) {
  const { usuario } = useAuth();
  return usuario ? children : <Navigate to="/login" replace />;
}
