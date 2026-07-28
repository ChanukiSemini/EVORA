import { Outlet } from 'react-router-dom'
import HamburgerMenu from '../../components/admin/HamburgerMenu'
import { CompanyProvider } from '../../context/admin/CompanyContext'
import { ChatProvider } from '../../context/admin/ChatContext'

function AdminLayout() {
  return (
    <CompanyProvider>
      <ChatProvider>
        <div className="admin-shell-simple">
          <HamburgerMenu />
          <div className="admin-content-simple">
            <Outlet />
          </div>
        </div>
      </ChatProvider>
    </CompanyProvider>
  )
}

export default AdminLayout