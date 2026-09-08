import { Navigate, Outlet } from 'react-router-dom'

function AdminRoute() {
  const token = localStorage.getItem('evora_token')
  const storedUser = JSON.parse(
    localStorage.getItem('evora_current_user') ||
    localStorage.getItem('evora_host_user') ||
    '{}'
  )

  const isHostOrAdmin =
    storedUser.role === 'host' ||
    storedUser.role === 'admin' ||
    Boolean(localStorage.getItem('evora_host_user'))

  // If token is missing and no host user is saved, redirect to login
  if (!token && !isHostOrAdmin) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default AdminRoute
