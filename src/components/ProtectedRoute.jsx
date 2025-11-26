import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return <h2>Carregando...</h2>;

  if (!user) return <Navigate to="/login" />;

  if (role && user.user_role !== role) return <Navigate to="/login" />;

  return children;
}
