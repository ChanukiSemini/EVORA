import { NavLink, useLocation, useNavigate } from 'react-router-dom'

function AdminSidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const isDashboardActive =
    location.pathname === '/admin' || location.pathname.startsWith('/admin/charger')
  const isManageActive =
    location.pathname.startsWith('/admin/manage-infrastructure') ||
    location.pathname.startsWith('/admin/register-hardware')

  const storedUser = JSON.parse(localStorage.getItem('evora_current_user') || localStorage.getItem('evora_host_user') || '{}');
  const displayName = storedUser.name || storedUser.company || 'Host Admin';
  const displayEmail = storedUser.email || 'host@evora.lk';
  const avatarLetter = (displayName[0] || 'H').toUpperCase();

  function handleLogout() {
    localStorage.removeItem('evora_token');
    localStorage.removeItem('evora_current_user');
    localStorage.removeItem('evora_host_user');
    navigate('/login');
  }

  const getLinkClass = (isActive) =>
    `sidebar-nav-item ${isActive ? 'active' : ''}`

  return (
    <aside className="admin-sidebar-desktop">
      <div className="sidebar-logo" onClick={() => navigate('/admin')} role="button" tabIndex={0}>
        <span className="sidebar-logo-icon">⚡</span>
        <span className="sidebar-logo-text">Evora</span>
        <span className="admin-badge">HOST</span>
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
          to="/admin/help-desk"
          className={({ isActive }) =>
            getLinkClass(
              isActive ||
              location.pathname.startsWith('/admin/help-desk') ||
              location.pathname.startsWith('/admin/support') ||
              location.pathname.startsWith('/admin/case') ||
              location.pathname.startsWith('/admin/chatbot')
            )
          }
        >
          <span className="sidebar-nav-icon">🎧</span>
          <span>Help Desk</span>
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
          <div className="sidebar-user-avatar">{avatarLetter}</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{displayName}</span>
            <span className="sidebar-user-email">{displayEmail}</span>
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
