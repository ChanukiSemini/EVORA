import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import BookCharger from './pages/BookCharger.jsx';
import Review from './pages/Review.jsx';
import Profile from './pages/Profile.jsx';
import MyVehicles from './pages/MyVehicles.jsx';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<LandingPage />} />
                <Route path="/book-charger" element={<BookCharger />} />
                <Route path="/bookings" element={<BookCharger />} />
                <Route path="/rate-session" element={<Review />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/vehicles" element={<MyVehicles />} />
                <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>
        </BrowserRouter>
    );
}
