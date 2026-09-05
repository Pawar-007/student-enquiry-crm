import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Admin-only pages. A logged-in Counsellor trying to reach these is redirected
// to their own dashboard rather than shown a broken/forbidden page.
export default function AdminRoute() {
  const { role } = useAuth();
  if (role !== 'ADMIN') {
    return <Navigate to="/counsellor/dashboard" replace />;
  }
  return <Outlet />;
}
