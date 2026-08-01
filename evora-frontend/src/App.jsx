import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import BookCharger from './pages/BookCharger'
import BookingConfirmed from './pages/BookingConfirmed'
import MyReservations from './pages/MyReservations'
import BookingDetails from './pages/BookingDetails'
import CancelBookingDemo from './pages/CancelBookingDemo'

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
      </Routes>
    </BrowserRouter>
  )
}

export default App