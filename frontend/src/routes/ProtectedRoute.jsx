import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from '../components/Loader/Loader.jsx';

/**
 * Guards routes that require authentication and, optionally, specific roles.
 * While the session is re-hydrating we show a loader instead of bouncing the
 * user to /login (which would break refreshes on protected pages).
 */
export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, role, booting } = useAuth();
  const location = useLocation();

  if (booting) return <Loader full label="Loading your workspace…" />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
