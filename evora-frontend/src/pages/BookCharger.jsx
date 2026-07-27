// ============================================
// src/pages/BookCharger.jsx
// EVORA - Book Your Charger Page
// ============================================

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import evHero from '../assets/ev-hero.jpg';

/* ---------- Station Mock Data ---------- */
const STATION = {
    name: 'Kaduwela Bay Charging Hub',
    address: 'Kaduwela Bay 01, Colombo',
    rating: 4.8,
    tag: 'Ultra-Fast',
    power: '150kW',
    model: 'Model 3',
};

const DATES = [
    { day: 'Sun', num: 26, month: 'July', shortMonth: 'Jul', year: 2026 },
    { day: 'Mon', num: 27, month: 'July', shortMonth: 'Jul', year: 2026 },
    { day: 'Tue', num: 28, month: 'July', shortMonth: 'Jul', year: 2026 },
    { day: 'Wed', num: 29, month: 'July', shortMonth: 'Jul', year: 2026 },
    { day: 'Thu', num: 30, month: 'July', shortMonth: 'Jul', year: 2026 },
    { day: 'Fri', num: 31, month: 'July', shortMonth: 'Jul', year: 2026 },
    { day: 'Sat', num: 1, month: 'August', shortMonth: 'Aug', year: 2026 },
];

const TIME_SLOTS = [
    { time: '9:00 AM', status: 'booked' },
    { time: '10:00 AM', status: 'booked' },
    { time: '11:00 AM', status: 'in-use' },
    { time: '12:00 PM', status: 'available' },
    { time: '1:00 PM', status: 'available' },
    { time: '2:00 PM', status: 'available' },
    { time: '3:00 PM', status: 'available' },
];

const CONNECTORS = [
    {
        id: 'ccs2',
        label: 'CCS2 (DC Fast)',
        shortLabel: 'CCS2',
        specs: 'DC Fast · Up to 150kW',
        ratePerHour: 2450,
    },
    {
        id: 'type2',
        label: 'Type 2 AC',
        shortLabel: 'Type 2 AC',
        specs: 'AC Standard · Up to 22kW',
        ratePerHour: 1680,
    },
    {
        id: 'chademo',
        label: 'CHAdeMO (DC)',
        shortLabel: 'CHAdeMO',
        specs: 'DC Fast · Up to 50kW',
        ratePerHour: 2280,
    },
];

const MIN_DURATION = 15;
const MAX_DURATION = 180;
const DURATION_STEP = 15;

const BookCharger = () => {
    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = useState(0);
    const [selectedTime, setSelectedTime] = useState(3); // 12:00 PM, first available
    const [duration, setDuration] = useState(60);
    const [connectorIdx, setConnectorIdx] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const connector = CONNECTORS[connectorIdx];
    const activeDateObj = DATES[selectedDate];

    const estCost = useMemo(() => {
        const hours = duration / 60;
        return Math.round(hours * connector.ratePerHour);
    }, [duration, connector]);

    const changeDuration = (delta) => {
        setDuration((d) => Math.min(MAX_DURATION, Math.max(MIN_DURATION, d + delta)));
    };

    const handleSelectTime = (i) => {
        if (TIME_SLOTS[i].status === 'available') setSelectedTime(i);
    };

    const handleConfirm = () => navigate('/booking-confirmed');

    /* ---------- Clean Text Connector Dropdown Menu ---------- */
    const ConnectorDropdownMenu = () => {
        return (
            <div className="connector-dropdown-wrap">
                <button
                    type="button"
                    className={`connector-dropdown-trigger ${dropdownOpen ? 'active' : ''}`}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    <div className="connector-trigger-text">
                        <span className="connector-title">{connector.label}</span>
                        <span className="connector-subtitle">{connector.specs}</span>
                    </div>
                    <span className={`connector-arrow ${dropdownOpen ? 'open' : ''}`}>▾</span>
                </button>

                {dropdownOpen && (
                    <div className="connector-dropdown-menu">
                        {CONNECTORS.map((c, i) => {
                            const isSelected = connectorIdx === i;
                            return (
                                <div
                                    key={c.id}
                                    className={`connector-dropdown-item ${isSelected ? 'selected' : ''}`}
                                    onClick={() => {
                                        setConnectorIdx(i);
                                        setDropdownOpen(false);
                                    }}
                                >
                                    <div className="connector-item-meta">
                                        <span className="connector-item-name">{c.label}</span>
                                        <span className="connector-item-specs">{c.specs}</span>
                                    </div>
                                    <div className="connector-item-right">
                                        <span className="connector-item-price">Rs. {c.ratePerHour.toLocaleString()}/hr</span>
                                        {isSelected && <span className="connector-check">✓</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    const DateChips = ({ className = '' }) => (
        <div className={`date-chips-row ${className}`}>
            {DATES.map((d, i) => (
                <button
                    key={i}
                    type="button"
                    className={`date-chip ${selectedDate === i ? 'active' : ''}`}
                    onClick={() => setSelectedDate(i)}
                >
                    <span className="date-chip-day">{d.day}</span>
                    <span className="date-chip-num">{d.num}</span>
                    <span className="date-chip-month">{d.shortMonth}</span>
                </button>
            ))}
        </div>
    );

    const TimeLegend = () => (
        <div className="time-legend">
            <span className="legend-item"><span className="legend-dot booked" />Booked</span>
            <span className="legend-item"><span className="legend-dot in-use" />In Use</span>
            <span className="legend-item"><span className="legend-dot available" />Available</span>
        </div>
    );

    const TimeBars = () => (
        <div className="time-bars-card">
            <div className="time-bars-row">
                {TIME_SLOTS.map((slot, i) => (
                    <div
                        key={i}
                        className="time-bar-wrap"
                        onClick={() => handleSelectTime(i)}
                        role="button"
                        tabIndex={0}
                        aria-disabled={slot.status !== 'available'}
                    >
                        <div className={`time-bar ${slot.status} ${selectedTime === i ? 'selected' : ''}`} />
                        <span className="time-bar-label">{slot.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    const DurationStepper = () => (
        <div className="duration-card">
            <button
                type="button"
                className="stepper-btn"
                onClick={() => changeDuration(-DURATION_STEP)}
                disabled={duration <= MIN_DURATION}
            >
                −
            </button>
            <div className="stepper-display">
                <span className="stepper-value">{duration}</span>
                <span className="stepper-unit">min</span>
            </div>
            <button
                type="button"
                className="stepper-btn"
                onClick={() => changeDuration(DURATION_STEP)}
                disabled={duration >= MAX_DURATION}
            >
                +
            </button>
        </div>
    );

    return (
        <>
            {/* ════════════════════════════════
                MOBILE LAYOUT (hidden ≥ 768px)
                ════════════════════════════════ */}
            <div className="evora-screen book-charger-screen mobile-only">
                <div className="nav-bar">
                    <button className="nav-back" onClick={() => navigate(-1)} title="Back">←</button>
                    <span className="nav-title">Book Your Charger</span>
                    <button className="nav-hamburger" onClick={() => setIsMobileMenuOpen(true)} title="Menu">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                            <line x1="4" y1="6" x2="20" y2="6" />
                            <line x1="4" y1="12" x2="20" y2="12" />
                            <line x1="4" y1="18" x2="20" y2="18" />
                        </svg>
                    </button>
                </div>
                <p className="bc-subtitle">{STATION.address}</p>

                <div className="station-banner">
                    <img src={evHero} alt={STATION.name} />
                    <div className="station-banner-overlay">
                        <span className="station-available-pill">
                            <span className="station-available-dot" /> Available Now
                        </span>
                        <span className="station-model-pill">{STATION.model} ▾</span>
                    </div>
                </div>
                <div className="station-kw-row">
                    <span className="station-kw">{STATION.tag} {STATION.power}</span>
                </div>

                <div className="section-label-row">
                    <span className="section-label">Connector Type</span>
                </div>
                <ConnectorDropdownMenu />

                <div className="section-label-row">
                    <span className="section-label">Select Date</span>
                    <span className="section-month-badge">{activeDateObj.month} {activeDateObj.year}</span>
                </div>
                <DateChips />

                <div className="section-label-row">
                    <span className="section-label">Time</span>
                    <TimeLegend />
                </div>
                <TimeBars />

                <div className="section-label-row">
                    <span className="section-label">Duration</span>
                </div>
                <DurationStepper />

                <div className="bottom-info-row">
                    <div className="info-pill">
                        <span className="info-pill-label">Selected Charger</span>
                        <span className="info-pill-value">{connector.shortLabel}</span>
                        <span className="info-pill-sub">{connector.specs}</span>
                    </div>
                    <div className="info-pill">
                        <span className="info-pill-label">Est. Total</span>
                        <span className="info-pill-value cost">Rs. {estCost.toLocaleString()}</span>
                        <span className="info-pill-sub">{duration} mins slot</span>
                    </div>
                </div>

                <div className="confirm-btn-wrap">
                    <button className="btn-primary" onClick={handleConfirm}>Confirm Booking</button>
                </div>

                {/* ---------- Mobile Navigation Drawer Overlay ---------- */}
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
                                <div className="mobile-menu-item" onClick={() => { navigate('/stations'); setIsMobileMenuOpen(false); }}>
                                    <span>🔍</span> Find Charging Stations
                                </div>
                                <div className="mobile-menu-item active" onClick={() => { navigate('/book-charger'); setIsMobileMenuOpen(false); }}>
                                    <span>⚡</span> Book a Charger
                                </div>
                                <div className="mobile-menu-item" onClick={() => { navigate('/bookings'); setIsMobileMenuOpen(false); }}>
                                    <span>📅</span> My Bookings
                                </div>
                                <div className="mobile-menu-item" onClick={() => { navigate('/rate-session'); setIsMobileMenuOpen(false); }}>
                                    <span>⭐</span> Rate Your Session
                                </div>
                                <div className="mobile-menu-item" onClick={() => { navigate('/vehicles'); setIsMobileMenuOpen(false); }}>
                                    <span>🚗</span> My Vehicles
                                </div>
                                <div className="mobile-menu-item" onClick={() => { navigate('/settings'); setIsMobileMenuOpen(false); }}>
                                    <span>⚙️</span> Settings
                                </div>
                            </nav>

                            <div className="mobile-menu-footer">
                                <div className="mobile-user-card">
                                    <div className="mobile-user-avatar">SJ</div>
                                    <div className="mobile-user-info">
                                        <span className="mobile-user-name">Sarah Jenkins</span>
                                        <span className="mobile-user-email">sarah.j@evora-charge.com</span>
                                    </div>
                                </div>
                                <button className="mobile-logout-btn" onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}>
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ════════════════════════════════
                DESKTOP LAYOUT (hidden < 768px)
                ════════════════════════════════ */}
            <div className="app-shell desktop-only">
                <Sidebar />

                <main className="app-main">
                    <div className="dt-topbar">
                        <button className="dt-back-btn" onClick={() => navigate(-1)}>←</button>
                        <div>
                            <h1 className="dt-page-title">Book a Charger</h1>
                            <p className="dt-page-subtitle">Reserve your slot at {STATION.name}</p>
                        </div>
                    </div>

                    <div className="dt-grid">
                        {/* -------- Left Column: Details & Selection -------- */}
                        <div className="dt-col-left">

                            <div className="card dt-station-card">
                                <div className="dt-station-img-wrap">
                                    <img src={evHero} alt={STATION.name} />
                                    <span className="dt-rating-pill">★ {STATION.rating}</span>
                                </div>
                                <div className="dt-station-meta">
                                    <div>
                                        <h2 className="dt-station-name">{STATION.name}</h2>
                                        <p className="dt-station-address">{STATION.address}</p>
                                    </div>
                                    <span className="tag tag-upcoming">{STATION.tag} · {STATION.power}</span>
                                </div>
                            </div>

                            <div className="card dt-section">
                                <div className="section-label-row" style={{ margin: 0 }}>
                                    <span className="section-label">Select Date</span>
                                    <span className="section-month-badge">{activeDateObj.month} {activeDateObj.year}</span>
                                </div>
                                <DateChips className="dt-date-chips" />
                            </div>

                            <div className="card dt-section">
                                <div className="section-label-row" style={{ margin: 0 }}>
                                    <span className="section-label">Select Time Slot</span>
                                    <TimeLegend />
                                </div>
                                <TimeBars />
                            </div>

                            <div className="card dt-section">
                                <span className="section-label">Charging Duration</span>
                                <DurationStepper />
                            </div>

                        </div>

                        {/* -------- Right Column: Booking Summary -------- */}
                        <div className="dt-col-right">
                            <div className="card dt-summary-card">
                                <div className="dt-summary-header">
                                    <h3 className="dt-summary-title">Booking Summary</h3>
                                </div>

                                <div className="dt-summary-station-info">
                                    <span className="dt-summary-hub-name">{STATION.name}</span>
                                    <span className="dt-summary-model-tag">{STATION.model}</span>
                                </div>

                                <div className="dt-connector-section">
                                    <span className="section-label">Connector Type</span>
                                    <ConnectorDropdownMenu />
                                </div>

                                <div className="card-divider" />

                                <div className="dt-summary-details">
                                    <div className="dt-summary-row">
                                        <span className="dt-row-label">Date</span>
                                        <span className="dt-row-value">{activeDateObj.day}, {activeDateObj.num} {activeDateObj.month} {activeDateObj.year}</span>
                                    </div>
                                    <div className="dt-summary-row">
                                        <span className="dt-row-label">Time Slot</span>
                                        <span className="dt-row-value highlight">{TIME_SLOTS[selectedTime].time}</span>
                                    </div>
                                    <div className="dt-summary-row">
                                        <span className="dt-row-label">Duration</span>
                                        <span className="dt-row-value">{duration} minutes</span>
                                    </div>
                                    <div className="dt-summary-row">
                                        <span className="dt-row-label">Plug Spec</span>
                                        <span className="dt-row-value">{connector.specs}</span>
                                    </div>
                                </div>

                                <div className="card-divider" />

                                <div className="dt-summary-total-box">
                                    <div className="dt-summary-total-row">
                                        <div>
                                            <span className="total-label-main">Estimated Total</span>
                                            <span className="total-label-sub">Taxes & fees included</span>
                                        </div>
                                        <span className="dt-summary-total-value">Rs. {estCost.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button className="btn-primary dt-confirm-btn" onClick={handleConfirm}>
                                    Confirm Booking
                                </button>

                                <div className="dt-summary-guarantee">
                                    <span>Instant Slot Reservation</span>
                                    <span>Free cancellation up to 1 hr before</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default BookCharger;
