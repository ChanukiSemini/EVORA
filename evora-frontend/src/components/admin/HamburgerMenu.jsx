import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isDashboardActive =
    location.pathname === '/admin' || location.pathname.startsWith('/admin/charger')
  const isManageActive =
    location.pathname.startsWith('/admin/manage-infrastructure') ||
    location.pathname.startsWith('/admin/register-hardware')

  function handleNavigate(path) {
    navigate(path)
    setIsOpen(false)
  }

  function handleLogout() {
    alert('Logged out (this is a placeholder — no real auth is connected yet).')
    setIsOpen(false)
  }

  const linkStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    borderRadius: '10px',
    color: isActive ? '#22e584' : '#e5e7eb',
    backgroundColor: isActive ? 'rgba(34, 229, 132, 0.1)' : 'transparent',
    fontSize: '15px',
    cursor: 'pointer',
    marginBottom: '4px',
    textDecoration: 'none',
  })

  return (
    <>
      <button className="hamburger-btn" onClick={() => setIsOpen(true)}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      {isOpen && (
        <div className="modal-backdrop" onClick={() => setIsOpen(false)}>
          <div className="hamburger-panel" onClick={(e) => e.stopPropagation()}>
            <div className="hamburger-header">
              <div>
                <h2 style={{ color: '#22e584' }}>EVORA</h2>
                <p style={{ color: '#9ca3af', fontSize: '12px' }}>Admin Console</p>
              </div>
              <button className="sheet-close" onClick={() => setIsOpen(false)}>✕</button>
            </div>

            <nav className="hamburger-nav">
              <div style={linkStyle(isDashboardActive)} onClick={() => handleNavigate('/admin')}>
                🏠 Dashboard
              </div>
              <div style={linkStyle(isManageActive)} onClick={() => handleNavigate('/admin/manage-infrastructure')}>
                🔧 Manage Chargers
              </div>
              <NavLink to="/admin/chatbot" style={({ isActive }) => linkStyle(isActive)} onClick={() => setIsOpen(false)}>
                🤖 Chatbot
              </NavLink>
              <NavLink to="/admin/reports" style={({ isActive }) => linkStyle(isActive)} onClick={() => setIsOpen(false)}>
                📈 Reports
              </NavLink>
            </nav>

            <div className="hamburger-footer">
              <div className="hamburger-profile">
                <div className="avatar-circle">P</div>
                <div>
                  <strong style={{ fontSize: '13px' }}>Admin Pamod</strong>
                  <p style={{ fontSize: '11px', color: '#9ca3af' }}>pamod@greencharge.lk</p>
                </div>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default HamburgerMenu