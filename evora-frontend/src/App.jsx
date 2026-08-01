import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import BookCharger from './pages/BookCharger'
import FindStation from './pages/FindStation'
import StationDetails from './pages/StationDetails'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/book-charger" element={<BookCharger />} />
        <Route path="/dashboard" element={<FindStation />} />
        <Route path="/station/:id" element={<StationDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App