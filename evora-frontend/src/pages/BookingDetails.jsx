// ============================================
// src/pages/BookingDetails.jsx
// EVORA - Booking Details Page
// Premium responsive layout (Mobile stacked & Desktop 2-column split grid)
// ============================================

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import evHero from '../assets/ev-hero.jpg';
import CancelBookingModal from '../components/CancelBookingModal';
import RescheduleBookingModal from '../components/RescheduleBookingModal';

/* ---------- SVG Icons ---------- */
const IconBack = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconMapPin = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M10 2a6 6 0 0 1 6 6c0 4-6 10-6 10S4 12 4 8a6 6 0 0 1 6-6Z" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
);

const IconCalendar = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 8H17" stroke="currentColor" strokeWidth="1.6" />
        <path d="M6.5 2.5V5.5M13.5 2.5V5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);

const IconClock = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 6.5V10.5L12.5 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconHourglass = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M5 3h10M5 17h10M6 3v3a4 4 0 0 0 2 3.5M14 3v3a4 4 0 0 1-2 3.5M8 9.5a4 4 0 0 0-2 3.5v3M12 9.5a4 4 0 0 1 2 3.5v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);

const IconBolt = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M11.2 1.7 3.4 11.4c-.3.4 0 1 .5 1h4.9l-1.2 6c-.1.6.6 1 1 .5l8-9.7c.3-.4 0-1-.5-1H11.2l1.2-6c.1-.6-.6-1-1.2-.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
);

const IconCar = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M3.5 12.5 4.8 8.2c.2-.7.9-1.2 1.6-1.2h7.2c.7 0 1.4.5 1.6 1.2l1.3 4.3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <rect x="2.5" y="12.5" width="15" height="4" rx="1.3" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="6" cy="16.5" r="1.2" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="14" cy="16.5" r="1.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
);

const IconAlertCircle = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 7v3.5M10 13.5h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

/* ---------- Mock Detailed Booking Data ---------- */
const DEFAULT_BOOKING = {
    id: '212456',
    status: 'UPCOMING',
    powerTag: 'Ultra-Fast 150kW',
    plugTag: 'CCS2',
    station: 'Keels Kaduwela Bay 01',
    address: 'No. 142, Kaduwela Road, Colombo',
    date: 'October 24, 2026',
    time: '10:30 AM',
    timeSlot: '10:30 AM – 11:30 AM',
    duration: '60 minutes',
    connector: 'CCS2 — DC Fast Charger · 50kW',
    vehicle: 'Tesla Model 3 (WP CAD-8821)',
    cost: 'Rs. 2,450',
    costSub: '(60 min · 150kW · Rs. 40/min)',
    canModify: true,
};

const BookingDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);

    const booking = {
        ...DEFAULT_BOOKING,
        id: id || DEFAULT_BOOKING.id,
    };

    const handleCancelConfirm = () => {
        setShowCancelModal(false);
        navigate('/bookings');
    };

    const handleRescheduleConfirm = () => {
        setShowRescheduleModal(false);
        navigate('/bookings');
    };

    /* Common Information List Component */
    const BookingInformationList = () => (
        <div className="bd-info-card card">
            <span className="bd-section-label">BOOKING INFORMATION</span>

            <div className="bd-info-list">
                <div className="bd-info-item">
                    <span className="bd-info-icon"><IconMapPin /></span>
                    <div className="bd-info-text">
                        <span className="bd-info-sublabel">Station Location</span>
                        <span className="bd-info-value">{booking.station}</span>
                        <span className="bd-info-extra">{booking.address}</span>
                    </div>
                </div>

                <div className="bd-info-item">
                    <span className="bd-info-icon"><IconCalendar /></span>
                    <div className="bd-info-text">
                        <span className="bd-info-sublabel">Date</span>
                        <span className="bd-info-value">{booking.date}</span>
                    </div>
                </div>

                <div className="bd-info-item">
                    <span className="bd-info-icon"><IconClock /></span>
                    <div className="bd-info-text">
                        <span className="bd-info-sublabel">Time</span>
                        <span className="bd-info-value">{booking.time}</span>
                        <span className="bd-info-extra">Slot: {booking.timeSlot}</span>
                    </div>
                </div>

                <div className="bd-info-item">
                    <span className="bd-info-icon"><IconHourglass /></span>
                    <div className="bd-info-text">
                        <span className="bd-info-sublabel">Duration</span>
                        <span className="bd-info-value">{booking.duration}</span>
                    </div>
                </div>

                <div className="bd-info-item">
                    <span className="bd-info-icon"><IconBolt /></span>
                    <div className="bd-info-text">
                        <span className="bd-info-sublabel">Connector Type</span>
                        <span className="bd-info-value">{booking.connector}</span>
                    </div>
                </div>

                <div className="bd-info-item">
                    <span className="bd-info-icon"><IconCar /></span>
                    <div className="bd-info-text">
                        <span className="bd-info-sublabel">Vehicle</span>
                        <span className="bd-info-value">{booking.vehicle}</span>
                    </div>
                </div>
            </div>

            {/* Station Amenities Badges */}
            <div className="bd-amenities-section">
                <span className="bd-section-label" style={{ fontSize: 10 }}>STATION AMENITIES</span>
                <div className="bd-amenities-row">
                    <span className="bd-amenity-badge">☕ Coffee Shop</span>
                    <span className="bd-amenity-badge">📶 Free Wi-Fi</span>
                    <span className="bd-amenity-badge">🏪 24/7 Market</span>
                    <span className="bd-amenity-badge">🚻 Restrooms</span>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* ════════════════════════════════
                MOBILE LAYOUT (< 768px)
                ════════════════════════════════ */}
            <div className="evora-screen booking-details-screen mobile-only">
                {/* Mobile Nav Bar */}
                <div className="bd-nav-bar">
                    <button className="nav-back" onClick={() => navigate(-1)} title="Back">
                        <IconBack />
                    </button>
                    <h1 className="bd-nav-title">Booking Details</h1>
                    <button className="nav-hamburger" onClick={() => setIsMobileMenuOpen(true)} title="Menu">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                            <line x1="4" y1="6" x2="20" y2="6" />
                            <line x1="4" y1="12" x2="20" y2="12" />
                            <line x1="4" y1="18" x2="20" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="bd-container">
                    {/* Top ID Card */}
                    <div className="bd-id-card card">
                        <div className="bd-id-text">
                            <span className="bd-id-label">BOOKING ID</span>
                            <h2 className="bd-id-value">#{booking.id}</h2>
                        </div>
                        <span className="bd-status-badge upcoming">
                            <span className="bd-badge-dot" /> {booking.status}
                        </span>
                    </div>

                    {/* Station Hero Image Banner */}
                    <div className="bd-hero-banner">
                        <img src={evHero} alt={booking.station} />
                        <div className="bd-hero-overlay">
                            <span className="bd-hero-tag-left">{booking.powerTag}</span>
                            <span className="bd-hero-tag-right">⚡ {booking.plugTag}</span>
                        </div>
                    </div>

                    {/* Booking Information */}
                    <BookingInformationList />

                    {/* Estimated Cost Card */}
                    <div className="bd-cost-card card">
                        <div className="bd-cost-left">
                            <span className="bd-section-label">ESTIMATED COST</span>
                            <span className="bd-cost-sub">{booking.costSub}</span>
                        </div>
                        <span className="bd-cost-value">{booking.cost}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="bd-actions-group">
                        <button
                            className={`bd-btn-reschedule ${!booking.canModify ? 'disabled' : ''}`}
                            onClick={() => booking.canModify && setShowRescheduleModal(true)}
                            disabled={!booking.canModify}
                        >
                            Reschedule Booking
                        </button>

                        <button
                            className={`bd-btn-cancel ${!booking.canModify ? 'disabled' : ''}`}
                            onClick={() => booking.canModify && setShowCancelModal(true)}
                            disabled={!booking.canModify}
                        >
                            Cancel Booking
                        </button>

                        {!booking.canModify && (
                            <div className="res-policy-notice">
                                <IconAlertCircle /> Reschedule / Cancel locked (&lt; 1 hr to session)
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
                            <div className="mobile-menu-header">
                                <div className="mobile-menu-logo">
                                    <span className="logo-icon">⚡</span>
                                    <span className="logo-text">Evora</span>
                                </div>
                                <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>✕</button>
                            </div>
                            <nav className="mobile-menu-nav">
                                <div className="mobile-menu-item" onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }}>
                                    <span>📊</span> Dashboard / Home
                                </div>
                                <div className="mobile-menu-item" onClick={() => { navigate('/book-charger'); setIsMobileMenuOpen(false); }}>
                                    <span>⚡</span> Book a Charger
                                </div>
                                <div className="mobile-menu-item active" onClick={() => { navigate('/bookings'); setIsMobileMenuOpen(false); }}>
                                    <span>📅</span> My Reservations
                                </div>
                            </nav>
                        </div>
                    </div>
                )}
            </div>

            {/* ════════════════════════════════
                DESKTOP LAYOUT (>= 768px - Modern 2-Column Split Grid)
                ════════════════════════════════ */}
            <div className="app-shell desktop-only">
                <Sidebar />

                <main className="app-main">
                    <div className="dt-topbar">
                        <button className="dt-back-btn" onClick={() => navigate(-1)}>←</button>
                        <div>
                            <h1 className="dt-page-title">Booking Details</h1>
                            <p className="dt-page-subtitle">View full charging session reservation details & station specifications</p>
                        </div>
                    </div>

                    <div className="dt-bd-grid">
                        {/* Left Column: Hero & Actions */}
                        <div className="dt-bd-col-left">
                            <div className="bd-id-card card">
                                <div className="bd-id-text">
                                    <span className="bd-id-label">BOOKING ID</span>
                                    <h2 className="bd-id-value">#{booking.id}</h2>
                                </div>
                                <span className="bd-status-badge upcoming">
                                    <span className="bd-badge-dot" /> {booking.status}
                                </span>
                            </div>

                            <div className="bd-hero-banner dt-bd-hero">
                                <img src={evHero} alt={booking.station} />
                                <div className="bd-hero-overlay">
                                    <span className="bd-hero-tag-left">{booking.powerTag}</span>
                                    <span className="bd-hero-tag-right">⚡ {booking.plugTag}</span>
                                </div>
                            </div>

                            <div className="bd-cost-card card">
                                <div className="bd-cost-left">
                                    <span className="bd-section-label">ESTIMATED COST</span>
                                    <span className="bd-cost-sub">{booking.costSub}</span>
                                </div>
                                <span className="bd-cost-value">{booking.cost}</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="bd-actions-group">
                                <button
                                    className={`bd-btn-reschedule ${!booking.canModify ? 'disabled' : ''}`}
                                    onClick={() => booking.canModify && setShowRescheduleModal(true)}
                                    disabled={!booking.canModify}
                                >
                                    Reschedule Booking
                                </button>

                                <button
                                    className={`bd-btn-cancel ${!booking.canModify ? 'disabled' : ''}`}
                                    onClick={() => booking.canModify && setShowCancelModal(true)}
                                    disabled={!booking.canModify}
                                >
                                    Cancel Booking
                                </button>

                                {!booking.canModify && (
                                    <div className="res-policy-notice">
                                        <IconAlertCircle /> Reschedule / Cancel locked (&lt; 1 hr to session)
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Full Specifications */}
                        <div className="dt-bd-col-right">
                            <BookingInformationList />
                        </div>
                    </div>
                </main>
            </div>

            {/* Cancel Modal */}
            {showCancelModal && (
                <CancelBookingModal
                    booking={booking}
                    onClose={() => setShowCancelModal(false)}
                    onConfirmCancel={handleCancelConfirm}
                />
            )}

            {/* Reschedule Modal */}
            {showRescheduleModal && (
                <RescheduleBookingModal
                    booking={booking}
                    onClose={() => setShowRescheduleModal(false)}
                    onConfirmReschedule={handleRescheduleConfirm}
                />
            )}
        </>
    );
};

export default BookingDetails;
