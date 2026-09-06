import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import AccountType from './pages/AccountType'
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
import Review from './pages/Review'
import Profile from './pages/Profile'
import MyVehicles from './pages/MyVehicles'
import DriverCreateAccount from './pages/DriverCreateAccount'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/account-type" element={<AccountType />} />
        <Route path="/choose-account-type" element={<AccountType />} />
        <Route path="/select-role" element={<AccountType />} />
        <Route path="/register-driver" element={<DriverCreateAccount />} />
        <Route path="/create-driver-account" element={<DriverCreateAccount />} />
        <Route path="/driver-register" element={<DriverCreateAccount />} />
        <Route path="/driver-create-account" element={<DriverCreateAccount />} />
        <Route path="/driver-signup" element={<DriverCreateAccount />} />
        <Route path="/signup" element={<DriverCreateAccount />} />
        <Route path="/dashboard" element={<LandingPage />} />
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
        <Route path="/rate-session" element={<Review />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Profile />} />
        <Route path="/vehicles" element={<MyVehicles />} />
        <Route path="/stations" element={<BookCharger />} />
        <Route path="/find" element={<BookCharger />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App