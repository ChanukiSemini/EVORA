import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import BookCharger from './pages/BookCharger'
import BookingConfirmed from './pages/BookingConfirmed'
import MyReservations from './pages/MyReservations'
import BookingDetails from './pages/BookingDetails'
import CancelBookingDemo from './pages/CancelBookingDemo'
import RescheduleBookingDemo from './pages/RescheduleBookingDemo'
import Review from './pages/Review'
import Profile from './pages/Profile'
import MyVehicles from './pages/MyVehicles'



// TEMPORARY: simulates a logged-in driver until real login exists.
// Once login is built, this will be set after a successful sign-in instead.
if (!localStorage.getItem('driverId')) {
    localStorage.setItem('driverId', '6a9925827fb2502dd5392d22');
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<LandingPage />} />
        <Route path="/book-charger" element={<BookCharger />} />
        <Route path="/booking-confirmed" element={<BookingConfirmed />} />
        <Route path="/bookings" element={<MyReservations />} />
        <Route path="/booking-details" element={<BookingDetails />} />
        <Route path="/booking-details/:id" element={<BookingDetails />} />
        <Route path="/cancel-booking" element={<CancelBookingDemo />} />
        <Route path="/reschedule-booking" element={<RescheduleBookingDemo />} />
        <Route path="/rate-session" element={<Review />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Profile />} />
        <Route path="/vehicles" element={<MyVehicles />} />
        <Route path="/stations" element={<BookCharger />} />
        <Route path="/find" element={<BookCharger />} />
        <Route path="/login" element={<LandingPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App