import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/LandingPage'
import BookCharger from './pages/BookCharger'
import BookingConfirmed from './pages/BookingConfirmed'
import MyReservations from './pages/MyReservations'
import BookingDetails from './pages/BookingDetails'
import CancelBookingDemo from './pages/CancelBookingDemo'
import RescheduleBookingDemo from './pages/RescheduleBookingDemo'
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
        <Route path="/booking-confirmed" element={<BookingConfirmed />} />
        <Route path="/bookings" element={<MyReservations />} />
        <Route path="/booking-details" element={<BookingDetails />} />
        <Route path="/booking-details/:id" element={<BookingDetails />} />
        <Route path="/cancel-booking" element={<CancelBookingDemo />} />
        <Route path="/reschedule-booking" element={<RescheduleBookingDemo />} />

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