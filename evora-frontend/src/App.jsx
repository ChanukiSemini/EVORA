import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import BookCharger from './pages/BookCharger'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/book-charger" element={<BookCharger />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App