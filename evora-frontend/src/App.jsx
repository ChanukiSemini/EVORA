import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import AccountType from './pages/AccountType'
import FindStation from './pages/FindStation'
import StationDetails from './pages/StationDetails'
import BookCharger from './pages/BookCharger'
import FindStation from './pages/FindStation'
import StationDetails from './pages/StationDetails'
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
import HostCreateAccount from './pages/HostCreateAccount'
import OtpVerification from './pages/OtpVerification'
import AccountCreatedSuccess from './pages/AccountCreatedSuccess'

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
        <Route path="/register-host" element={<HostCreateAccount />} />
        <Route path="/create-host-account" element={<HostCreateAccount />} />
        <Route path="/host-register" element={<HostCreateAccount />} />
        <Route path="/host-create-account" element={<HostCreateAccount />} />
        <Route path="/host-signup" element={<HostCreateAccount />} />
        <Route path="/verify-otp" element={<OtpVerification />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/otp" element={<OtpVerification />} />
        <Route path="/account-success" element={<AccountCreatedSuccess />} />
        <Route path="/account-created" element={<AccountCreatedSuccess />} />
        <Route path="/registration-success" element={<AccountCreatedSuccess />} />
        <Route path="/dashboard" element={<FindStation />} />
        <Route path="/find-station" element={<FindStation />} />
        <Route path="/station/:id" element={<StationDetails />} />
        <Route path="/book-charger" element={<BookCharger />} />
        <Route path="/station/:id" element={<StationDetails />} />
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