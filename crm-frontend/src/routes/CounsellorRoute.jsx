import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Counsellor-only pages. An Admin visiting them is redirected to the admin
// dashboard — Admin has a superset workflow through the Admin section instead.
export default function CounsellorRoute() {
  const { role } = useAuth();
  if (role !== 'COUNSELLOR') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Outlet />;
}
