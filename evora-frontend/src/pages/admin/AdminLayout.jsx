import { Outlet } from 'react-router-dom'
import AdminSidebar from '../../components/admin/AdminSidebar'
import HamburgerMenu from '../../components/admin/HamburgerMenu'
import { CompanyProvider } from '../../context/admin/CompanyContext'
import { ChatProvider } from '../../context/admin/ChatContext'
import '../../styles/admin.css'

function AdminLayout() {
  return (
    <CompanyProvider>
      <ChatProvider>
        <div className="admin-app-shell">
          <AdminSidebar />
          <HamburgerMenu />
          <main className="admin-main-content">
            <Outlet />
          </main>
        </div>
      </ChatProvider>
    </CompanyProvider>
  )
}

export default AdminLayout