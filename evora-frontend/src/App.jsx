import { useCallback, useMemo, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import IconSprite from './components/IconSprite.jsx';
import Sidebar from './components/Sidebar.jsx';
import MobileDrawer from './components/MobileDrawer.jsx';
import Header from './components/Header.jsx';
import Review from './pages/Review.jsx';
import Profile from './pages/Profile.jsx';
import MyVehicles from './pages/MyVehicles.jsx';

const USER = {
    name: 'Sarah Jenkins',
    email: 'sarah.j@evora-charge.com',
    avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
};

export default function App() {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const openMobileMenu = useCallback(() => setMobileMenuOpen(true), []);
    const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

    const handleBack = useCallback(() => {
        navigate('/');
    }, [navigate]);

    const headerTitle = useMemo(() => {
        if (location.pathname === '/profile') return 'Personal Details';
        if (location.pathname === '/vehicles') return 'My Vehicles';
        return 'Rate Charging Session';
    }, [location.pathname]);

    return (
        <>
            <IconSprite />

            {/* ═══════ DESKTOP LAYOUT (hidden < 768px) ═══════ */}
            <div className="app-shell desktop-only">
                <Sidebar user={USER} />

                <main className="app-main">
                    <div className="dt-topbar">
                        <button className="dt-back-btn" onClick={handleBack}>←</button>
                        <div>
                            <h1 className="dt-page-title">{headerTitle}</h1>
                        </div>
                    </div>

                    <div className="dt-content">
                        <Routes>
                            <Route path="/" element={<Review />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/vehicles" element={<MyVehicles />} />
                            <Route path="*" element={
                                <div style={{ padding: '2rem', textAlign: 'center' }}>
                                    <h2>Page Not Found</h2>
                                    <p>The requested page mockup is not implemented.</p>
                                </div>
                            } />
                        </Routes>
                    </div>
                </main>
            </div>

            {/* ═══════ MOBILE LAYOUT (hidden >= 768px) ═══════ */}
            <div className="mobile-only">
                <Header onBack={handleBack} onOpenDrawer={openMobileMenu} isDrawerOpen={isMobileMenuOpen} title={headerTitle} />

                <MobileDrawer
                    isOpen={isMobileMenuOpen}
                    onClose={closeMobileMenu}
                    user={USER}
                />

                <main className="evora-screen">
                    <Routes>
                        <Route path="/" element={<Review />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/vehicles" element={<MyVehicles />} />
                        <Route path="*" element={
                            <div style={{ padding: '2rem', textAlign: 'center' }}>
                                <h2>Page Not Found</h2>
                                <p>The requested page mockup is not implemented.</p>
                            </div>
                        } />
                    </Routes>
                </main>
            </div>
        </>
    );
}
