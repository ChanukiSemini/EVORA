// ============================================
// src/pages/BookingConfirmed.jsx
// EVORA - Booking Confirmed Pop-up Modal
// Fully responsive across Mobile, iPad/Tablet & Desktop
// ============================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookCharger from './BookCharger';

/* ---------- Icon components ---------- */
const IconCheck = () => (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
        <path
            d="M9 19.5L15.5 26L29 13"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const IconMapPin = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <path
            d="M10 2a6 6 0 0 1 6 6c0 4-6 10-6 10S4 12 4 8a6 6 0 0 1 6-6Z"
            stroke="currentColor"
            strokeWidth="1.6"
        />
        <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
);

const IconCalendar = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 8H17" stroke="currentColor" strokeWidth="1.6" />
        <path d="M6.5 2.5V5.5M13.5 2.5V5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);

const IconClock = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 6.5V10.5L12.5 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconArrowRight = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <path d="M4 10H16M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/* ---------- Mock booking data ---------- */
const BOOKING = {
    id: '212456',
    station: 'Keels Kaduwela Bay 01',
    stationLabel: 'Station Location',
    dateTime: '22nd March 10:00 A.M.',
    dateTimeLabel: 'Date & Time',
    duration: '60 min',
    durationLabel: 'Estimated Duration',
};

const BookingConfirmedModal = ({ onClose, onNavigateBookings }) => {
    const navigate = useNavigate();
    const [showCheck, setShowCheck] = useState(false);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const t1 = setTimeout(() => setShowCheck(true), 120);
        const t2 = setTimeout(() => setShowContent(true), 450);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            navigate('/book-charger');
        }
    };

    const handleViewBookings = () => {
        if (onNavigateBookings) {
            onNavigateBookings();
        } else {
            navigate('/bookings');
        }
    };

    return (
        <div className="bc-modal-backdrop" onClick={handleClose}>
            {/* Modal Card container */}
            <div className="bc-modal-card" onClick={(e) => e.stopPropagation()}>
                
                {/* Close Button */}
                <button
                    className="bc-close-btn"
                    onClick={handleClose}
                    title="Close"
                    aria-label="Close modal"
                >
                    ✕
                </button>

                {/* Animated check circle */}
                <div className={`bc-check-ring-wrap ${showCheck ? 'visible' : ''}`}>
                    <div className="bc-ring bc-ring-outer" />
                    <div className="bc-ring bc-ring-mid" />
                    <div className="bc-check-circle">
                        <IconCheck />
                    </div>
                    {[...Array(8)].map((_, i) => (
                        <span key={i} className={`bc-spark bc-spark-${i + 1}`} />
                    ))}
                </div>

                {/* Title & Booking ID */}
                <div className={`bc-title-block ${showContent ? 'visible' : ''}`}>
                    <h2 className="bc-title">Booking Confirmed</h2>
                    <p className="bc-booking-id">Booking Id : {BOOKING.id}</p>
                </div>

                {/* Booking details card */}
                <div className={`bc-content-block ${showContent ? 'visible' : ''}`}>
                    <div className="bc-detail-card">
                        <div className="bc-detail-row">
                            <span className="bc-detail-icon bc-icon-accent"><IconMapPin /></span>
                            <div className="bc-detail-text">
                                <span className="bc-detail-value">{BOOKING.station}</span>
                                <span className="bc-detail-label">{BOOKING.stationLabel}</span>
                            </div>
                        </div>
                        <div className="bc-detail-divider" />
                        <div className="bc-detail-row">
                            <span className="bc-detail-icon bc-icon-cyan"><IconCalendar /></span>
                            <div className="bc-detail-text">
                                <span className="bc-detail-value">{BOOKING.dateTime}</span>
                                <span className="bc-detail-label">{BOOKING.dateTimeLabel}</span>
                            </div>
                        </div>
                        <div className="bc-detail-divider" />
                        <div className="bc-detail-row">
                            <span className="bc-detail-icon bc-icon-amber"><IconClock /></span>
                            <div className="bc-detail-text">
                                <span className="bc-detail-value">{BOOKING.duration}</span>
                                <span className="bc-detail-label">{BOOKING.durationLabel}</span>
                            </div>
                        </div>
                    </div>

                    {/* View My Bookings button */}
                    <button className="bc-view-btn" onClick={handleViewBookings}>
                        View My Bookings <IconArrowRight />
                    </button>
                </div>

                {/* Footer Brand Mark */}
                <div className="bc-footer-brand">
                    <span>◆ EVORA</span>
                </div>
            </div>
        </div>
    );
};

/* Page component wrapping BookCharger with the popup modal */
const BookingConfirmed = () => {
    return (
        <div className="booking-confirmed-page-wrapper">
            <BookCharger />
            <BookingConfirmedModal />
        </div>
    );
};

export default BookingConfirmed;
export { BookingConfirmedModal };
