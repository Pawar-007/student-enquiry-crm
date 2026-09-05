import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Used for /login — if already authenticated, skip straight to the role dashboard
// instead of showing the login form again.
export default function PublicRoute() {
  const { isAuthenticated, role } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={role === 'ADMIN' ? '/admin/dashboard' : '/counsellor/dashboard'} replace />;
  }
  return <Outlet />;
}
