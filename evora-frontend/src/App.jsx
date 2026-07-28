import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import BookCharger from './pages/BookCharger'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import ChargerNodeDetails from './pages/admin/ChargerNodeDetails'
import ManageInfrastructure from './pages/admin/ManageInfrastructure'
import RegisterHardware from './pages/admin/RegisterHardware'
import Chatbot from './pages/admin/Chatbot'
import CaseDetail from './pages/admin/CaseDetail'
import Reports from './pages/admin/Reports'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/book-charger" element={<BookCharger />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="charger/:id" element={<ChargerNodeDetails />} />
          <Route path="manage-infrastructure" element={<ManageInfrastructure />} />
          <Route path="register-hardware" element={<RegisterHardware />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="case/:caseId" element={<CaseDetail />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App