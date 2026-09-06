import { NavLink, useLocation, useNavigate } from 'react-router-dom'

function AdminSidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const isDashboardActive =
    location.pathname === '/admin' || location.pathname.startsWith('/admin/charger')
  const isManageActive =
    location.pathname.startsWith('/admin/manage-infrastructure') ||
    location.pathname.startsWith('/admin/register-hardware')

  function handleLogout() {
    alert('Logged out (this is a placeholder — no real auth is connected yet).')
  }

  const getLinkClass = (isActive) =>
    `sidebar-nav-item ${isActive ? 'active' : ''}`

  return (
    <aside className="admin-sidebar-desktop">
      <div className="sidebar-logo" onClick={() => navigate('/admin')} role="button" tabIndex={0}>
        <span className="sidebar-logo-icon">⚡</span>
        <span className="sidebar-logo-text">Evora</span>
        <span className="admin-badge">ADMIN</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/admin"
          end
          className={() => getLinkClass(isDashboardActive)}
        >
          <span className="sidebar-nav-icon">🏠</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/manage-infrastructure"
          className={() => getLinkClass(isManageActive)}
        >
          <span className="sidebar-nav-icon">🔧</span>
          <span>Manage Chargers</span>
        </NavLink>

        <NavLink
          to="/admin/chatbot"
          className={({ isActive }) => getLinkClass(isActive)}
        >
          <span className="sidebar-nav-icon">🤖</span>
          <span>Chatbot</span>
        </NavLink>

        <NavLink
          to="/admin/reports"
          className={({ isActive }) => getLinkClass(isActive)}
        >
          <span className="sidebar-nav-icon">📈</span>
          <span>Reports</span>
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user-card">
          <div className="sidebar-user-avatar">P</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">Admin Pamod</span>
            <span className="sidebar-user-email">pamod@greencharge.lk</span>
          </div>
        </div>
        <button className="sidebar-logout-btn" onClick={handleLogout}>
          🚪 Log Out
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar
