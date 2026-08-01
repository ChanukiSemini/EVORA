import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import BookCharger from './pages/BookCharger'
import Review from './pages/Review'
import Profile from './pages/Profile'
import MyVehicles from './pages/MyVehicles'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/book-charger" element={<BookCharger />} />
        <Route path="/rate-session" element={<Review />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/vehicles" element={<MyVehicles />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App