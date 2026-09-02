import { Navigate } from 'react-router-dom'
import { useCurrentUser } from '../hooks/useAuth'

export default function RoleRedirect() {
  const user = useCurrentUser()
  if (!user) return <Navigate to="/staff-login" replace />
  return <Navigate to={user.role === 'Admin' ? '/portal/dashboard' : '/portal/my-enquiries'} replace />
}
