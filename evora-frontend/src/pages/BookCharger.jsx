// ============================================
// src/pages/BookCharger.jsx
// EVORA - Book Your Charger Page (Pixel-perfect Redesign)
// ============================================

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
    IconBolt,
    IconCalendar,
    IconReceipt,
    IconCreditCard,
    IconCCTV,
    IconRestroom,
    IconLounge,
    IconSupport,
    IconShield,
    IconLeaf,
} from '../components/NavigationIcons.jsx';

import kaduwelaHero from '../assets/kaduwela-bay-hero.jpg';
import kaduwelaThumb from '../assets/kaduwela-bay-thumb.jpg';

/* ---------- Station Mock Data ---------- */
const STATION = {
    name: 'Kaduwela Bay Charging Hub',
    address: 'Kaduwela Bay 01, Colombo',
    rating: '4.8',
    reviewsCount: '120+ reviews',
    tag: 'Ultra-Fast',
    power: 'Up to 150kW',
    model: 'Model 3',
    amenities: [
        { icon: IconCCTV, title: 'CCTV', sub: 'Secured' },
        { icon: IconRestroom, title: 'Restroom', sub: 'Available' },
        { icon: IconLounge, title: 'Waiting Area', sub: 'Comfortable' },
        { icon: IconSupport, title: '24/7', sub: 'Support' },
    ],
};

const DATES = [
    { day: 'Sun', num: 26, month: 'July', shortMonth: 'JUL', year: 2026 },
    { day: 'Mon', num: 27, month: 'July', shortMonth: 'JUL', year: 2026 },
    { day: 'Tue', num: 28, month: 'July', shortMonth: 'JUL', year: 2026 },
    { day: 'Wed', num: 29, month: 'July', shortMonth: 'JUL', year: 2026 },
    { day: 'Thu', num: 30, month: 'July', shortMonth: 'JUL', year: 2026 },
    { day: 'Fri', num: 31, month: 'July', shortMonth: 'JUL', year: 2026 },
    { day: 'Sat', num: 1, month: 'August', shortMonth: 'AUG', year: 2026 },
];

const TIME_SLOTS = [
    { time: '12:00 AM', status: 'available' },
    { time: '1:00 AM', status: 'available' },
    { time: '2:00 AM', status: 'available' },
    { time: '3:00 AM', status: 'available' },
    { time: '4:00 AM', status: 'available' },
    { time: '5:00 AM', status: 'available' },
    { time: '6:00 AM', status: 'available' },
    { time: '7:00 AM', status: 'available' },
    { time: '8:00 AM', status: 'available' },
    { time: '9:00 AM', status: 'available' },
    { time: '10:00 AM', status: 'available' },
    { time: '11:00 AM', status: 'in-use' },
    { time: '12:00 PM', status: 'available' },
    { time: '1:00 PM', status: 'available' },
    { time: '2:00 PM', status: 'available' },
    { time: '3:00 PM', status: 'available' },
    { time: '4:00 PM', status: 'available' },
    { time: '5:00 PM', status: 'available' },
    { time: '6:00 PM', status: 'in-use' },
    { time: '7:00 PM', status: 'booked' },
    { time: '8:00 PM', status: 'booked' },
    { time: '9:00 PM', status: 'available' },
    { time: '10:00 PM', status: 'available' },
    { time: '11:00 PM', status: 'available' },
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

const DURATION_PRESETS = [30, 60, 90, 120];
const MIN_DURATION = 15;
const MAX_DURATION = 180;
const DURATION_STEP = 15;

/* ---------- Dropdown for Connector Selection ---------- */
const ConnectorDropdownMenu = ({ connector, connectorIdx, setConnectorIdx, dropdownOpen, setDropdownOpen }) => {
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

const BookCharger = () => {
    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = useState(0);
    const [selectedTime, setSelectedTime] = useState(12); // 12:00 PM default active
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
        setSelectedTime(i);
    };

    const handleConfirm = () => navigate('/booking-confirmed');

    return (
        <div className="app-shell book-charger-shell">
            {/* Desktop Sidebar (and tablet responsive view) */}
            <Sidebar />

            <main className="app-main book-charger-main">
                {/* ── Top Header Bar ── */}
                <header className="bc-topbar">
                    <div className="bc-topbar-left">
                        <button
                            type="button"
                            className="bc-back-btn"
                            onClick={() => navigate(-1)}
                            title="Go Back"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="bc-header-titles">
                            <h1 className="bc-page-title">Book a Charger</h1>
                            <p className="bc-page-subtitle">
                                Find and reserve your charging slot at {STATION.name}.
                            </p>
                        </div>
                    </div>

                    {/* Mobile Hamburger (visible on mobile screens) */}
                    <button
                        type="button"
                        className="bc-mobile-menu-btn"
                        onClick={() => setIsMobileMenuOpen(true)}
                        title="Open Menu"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="4" y1="6" x2="20" y2="6" />
                            <line x1="4" y1="12" x2="20" y2="12" />
                            <line x1="4" y1="18" x2="20" y2="18" />
                        </svg>
                    </button>
                </header>

                {/* ── Main Two-Column Layout ── */}
                <div className="bc-content-grid">
                    {/* ════════ Left Column ════════ */}
                    <section className="bc-left-col">
                        {/* 1. Station Hero Banner Card */}
                        <div className="bc-hero-card">
                            <div className="bc-hero-media">
                                <img
                                    src={kaduwelaHero}
                                    alt={STATION.name}
                                    className="bc-hero-img"
                                />
                                <div className="bc-hero-overlay" />
                            </div>

                            {/* Top Badges */}
                            <div className="bc-hero-top-badges">
                                <div className="bc-rating-badge">
                                    <span className="bc-star">★</span>
                                    <span className="bc-rating-val">{STATION.rating}</span>
                                    <span className="bc-reviews-count">({STATION.reviewsCount})</span>
                                </div>

                                <div className="bc-speed-badge">
                                    <span className="bc-speed-icon">
                                        <IconBolt filled />
                                    </span>
                                    <div className="bc-speed-text">
                                        <span className="bc-speed-tag">{STATION.tag}</span>
                                        <span className="bc-speed-sub">{STATION.power}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Station Details & Amenities */}
                            <div className="bc-hero-bottom-info">
                                <div className="bc-hero-title-group">
                                    <h2 className="bc-hero-title">{STATION.name}</h2>
                                    <p className="bc-hero-location">
                                        <span className="bc-pin-icon">📍</span>
                                        {STATION.address}
                                    </p>
                                </div>

                                <div className="bc-amenities-row">
                                    {STATION.amenities.map((item, idx) => {
                                        const ItemIcon = item.icon;
                                        return (
                                            <div key={idx} className="bc-amenity-pill">
                                                <span className="bc-amenity-icon">
                                                    <ItemIcon />
                                                </span>
                                                <div className="bc-amenity-text">
                                                    <span className="bc-amenity-name">{item.title}</span>
                                                    <span className="bc-amenity-sub">{item.sub}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* 2. Select Date Card */}
                        <div className="bc-section-card">
                            <div className="bc-card-header">
                                <div className="bc-card-header-left">
                                    <span className="bc-card-icon">
                                        <IconCalendar />
                                    </span>
                                    <h3 className="bc-card-title">Select Date</h3>
                                </div>
                                <div className="bc-calendar-controls">
                                    <span className="bc-month-display">
                                        {activeDateObj.month} {activeDateObj.year}
                                    </span>
                                    <div className="bc-month-arrows">
                                        <button
                                            type="button"
                                            className="bc-arrow-btn"
                                            onClick={() => setSelectedDate((prev) => Math.max(0, prev - 1))}
                                            title="Previous Month"
                                        >
                                            ‹
                                        </button>
                                        <button
                                            type="button"
                                            className="bc-arrow-btn"
                                            onClick={() => setSelectedDate((prev) => Math.min(DATES.length - 1, prev + 1))}
                                            title="Next Month"
                                        >
                                            ›
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bc-date-chips-grid">
                                {DATES.map((d, i) => {
                                    const isSelected = selectedDate === i;
                                    return (
                                        <button
                                            key={i}
                                            type="button"
                                            className={`bc-date-chip ${isSelected ? 'active' : ''}`}
                                            onClick={() => setSelectedDate(i)}
                                        >
                                            <span className="bc-chip-day">{d.day}</span>
                                            <span className="bc-chip-num">{d.num}</span>
                                            <span className="bc-chip-month">{d.shortMonth}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 3. Select Time Slot Card */}
                        <div className="bc-section-card">
                            <div className="bc-card-header">
                                <div className="bc-card-header-left">
                                    <span className="bc-card-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                    </span>
                                    <h3 className="bc-card-title">Select Time Slot</h3>
                                </div>
                                <div className="bc-time-legend">
                                    <span className="bc-legend-item">
                                        <span className="bc-legend-dot available" />
                                        Available
                                    </span>
                                    <span className="bc-legend-item">
                                        <span className="bc-legend-dot in-use" />
                                        In Use
                                    </span>
                                    <span className="bc-legend-item">
                                        <span className="bc-legend-dot booked" />
                                        Booked
                                    </span>
                                </div>
                            </div>

                            <div className="bc-time-slots-row">
                                {TIME_SLOTS.map((slot, i) => {
                                    const isSelected = selectedTime === i;
                                    return (
                                        <button
                                            key={i}
                                            type="button"
                                            className={`bc-time-btn ${slot.status} ${isSelected ? 'selected' : ''}`}
                                            onClick={() => handleSelectTime(i)}
                                        >
                                            {slot.time}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 4. Charging Duration Card */}
                        <div className="bc-section-card">
                            <div className="bc-duration-header">
                                <div className="bc-card-header-left">
                                    <span className="bc-card-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                    </span>
                                    <div>
                                        <h3 className="bc-card-title">Charging Duration</h3>
                                        <p className="bc-card-desc">Select how long you plan to charge.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Stepper + Range Slider */}
                            <div className="bc-slider-row">
                                <button
                                    type="button"
                                    className="bc-stepper-btn"
                                    onClick={() => changeDuration(-DURATION_STEP)}
                                    disabled={duration <= MIN_DURATION}
                                    title="Decrease Duration"
                                >
                                    −
                                </button>

                                <div className="bc-slider-track-wrap">
                                    <input
                                        type="range"
                                        min={MIN_DURATION}
                                        max={MAX_DURATION}
                                        step={DURATION_STEP}
                                        value={duration}
                                        onChange={(e) => setDuration(Number(e.target.value))}
                                        className="bc-range-slider"
                                        style={{
                                            background: `linear-gradient(to right, #00E599 0%, #00E599 ${((duration - MIN_DURATION) / (MAX_DURATION - MIN_DURATION)) * 100}%, rgba(255, 255, 255, 0.15) ${((duration - MIN_DURATION) / (MAX_DURATION - MIN_DURATION)) * 100}%, rgba(255, 255, 255, 0.15) 100%)`
                                        }}
                                    />
                                </div>

                                <div className="bc-duration-value-display">
                                    <span className="bc-duration-num">{duration}</span>
                                    <span className="bc-duration-unit">min</span>
                                </div>

                                <button
                                    type="button"
                                    className="bc-stepper-btn"
                                    onClick={() => changeDuration(DURATION_STEP)}
                                    disabled={duration >= MAX_DURATION}
                                    title="Increase Duration"
                                >
                                    +
                                </button>
                            </div>

                            {/* Duration Preset Pills */}
                            <div className="bc-duration-presets-row">
                                {DURATION_PRESETS.map((preset) => (
                                    <button
                                        key={preset}
                                        type="button"
                                        className={`bc-preset-chip ${duration === preset ? 'active' : ''}`}
                                        onClick={() => setDuration(preset)}
                                    >
                                        {preset} min
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ════════ Right Column: Booking Summary ════════ */}
                    <aside className="bc-right-col">
                        <div className="bc-summary-card">
                            {/* Summary Header */}
                            <div className="bc-summary-header">
                                <div className="bc-summary-icon-badge">
                                    <IconReceipt />
                                </div>
                                <div>
                                    <h3 className="bc-summary-title">Booking Summary</h3>
                                    <p className="bc-summary-subtitle">Review your selection before confirming.</p>
                                </div>
                            </div>

                            {/* Station mini summary box */}
                            <div className="bc-summary-station-box">
                                <div className="bc-summary-station-media">
                                    <img
                                        src={kaduwelaThumb}
                                        alt={STATION.name}
                                        className="bc-summary-thumb-img"
                                    />
                                </div>
                                <div className="bc-summary-station-text">
                                    <h4 className="bc-summary-station-name">{STATION.name}</h4>
                                    <p className="bc-summary-station-loc">{STATION.address}</p>
                                </div>
                                <span className="bc-summary-model-pill">{STATION.model}</span>
                            </div>

                            {/* Detail List */}
                            <div className="bc-summary-specs-list">
                                <div className="bc-summary-spec-row">
                                    <span className="bc-spec-label">
                                        <span className="bc-spec-icon"><IconCalendar /></span> Date
                                    </span>
                                    <span className="bc-spec-value">
                                        {activeDateObj.day}, {activeDateObj.num} {activeDateObj.month} {activeDateObj.year}
                                    </span>
                                </div>

                                <div className="bc-summary-spec-row">
                                    <span className="bc-spec-label">
                                        <span className="bc-spec-icon">
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                        </span> Time Slot
                                    </span>
                                    <span className="bc-spec-value bc-highlight">
                                        {TIME_SLOTS[selectedTime].time}
                                    </span>
                                </div>

                                <div className="bc-summary-spec-row">
                                    <span className="bc-spec-label">
                                        <span className="bc-spec-icon">
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                        </span> Duration
                                    </span>
                                    <span className="bc-spec-value">
                                        {duration} minutes
                                    </span>
                                </div>

                                <div className="bc-summary-spec-row bc-connector-row">
                                    <span className="bc-spec-label">
                                        <span className="bc-spec-icon">
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v8M18 10a6 6 0 0 1-12 0V2h12v8Z" /><path d="M12 16v6" /></svg>
                                        </span> Connector Type
                                    </span>
                                    <div className="bc-spec-right-col">
                                        <span className="bc-spec-value">{connector.label}</span>
                                        <span className="bc-spec-sub">{connector.specs}</span>
                                    </div>
                                </div>

                                <div className="bc-summary-spec-row">
                                    <span className="bc-spec-label">
                                        <span className="bc-spec-icon"><IconBolt /></span> Plug Spec
                                    </span>
                                    <span className="bc-spec-value">
                                        {connector.specs}
                                    </span>
                                </div>
                            </div>

                            {/* Connector Interactive Dropdown Selector (Clean toggle) */}
                            <div className="bc-connector-selector-box">
                                <ConnectorDropdownMenu
                                    connector={connector}
                                    connectorIdx={connectorIdx}
                                    setConnectorIdx={setConnectorIdx}
                                    dropdownOpen={dropdownOpen}
                                    setDropdownOpen={setDropdownOpen}
                                />
                            </div>

                            {/* Estimated Total Box */}
                            <div className="bc-total-card">
                                <div className="bc-total-left">
                                    <span className="bc-total-icon">
                                        <IconCreditCard />
                                    </span>
                                    <div>
                                        <span className="bc-total-title">Estimated Total</span>
                                        <span className="bc-total-sub">Taxes & fees included</span>
                                    </div>
                                </div>
                                <div className="bc-total-price">
                                    Rs. {estCost.toLocaleString()}
                                </div>
                            </div>

                            {/* Confirm CTA Button */}
                            <button
                                type="button"
                                className="bc-confirm-btn"
                                onClick={handleConfirm}
                            >
                                <span>Confirm Booking</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </button>

                            {/* Trust & Guarantee Badges */}
                            <div className="bc-trust-grid">
                                <div className="bc-trust-item">
                                    <span className="bc-trust-icon"><IconCalendar /></span>
                                    <div className="bc-trust-text">
                                        <span className="bc-trust-bold">Instant</span>
                                        <span className="bc-trust-desc">Reservation</span>
                                    </div>
                                </div>

                                <div className="bc-trust-item">
                                    <span className="bc-trust-icon"><IconShield /></span>
                                    <div className="bc-trust-text">
                                        <span className="bc-trust-bold">Free cancellation</span>
                                        <span className="bc-trust-desc">up to 1 hr before</span>
                                    </div>
                                </div>

                                <div className="bc-trust-item">
                                    <span className="bc-trust-icon"><IconLeaf /></span>
                                    <div className="bc-trust-text">
                                        <span className="bc-trust-bold">100% Green</span>
                                        <span className="bc-trust-desc">Energy</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* ── Mobile Navigation Drawer Overlay ── */}
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
                                <div className="mobile-menu-item active" onClick={() => { navigate('/book-charger'); setIsMobileMenuOpen(false); }}>
                                    <span>⚡</span> Book a Charger
                                </div>
                                <div className="mobile-menu-item" onClick={() => { navigate('/bookings'); setIsMobileMenuOpen(false); }}>
                                    <span>📅</span> My Reservations
                                </div>
                                <div className="mobile-menu-item" onClick={() => { navigate('/vehicles'); setIsMobileMenuOpen(false); }}>
                                    <span>🚗</span> My Vehicles
                                </div>
                                <div className="mobile-menu-item" onClick={() => { navigate('/payment-methods'); setIsMobileMenuOpen(false); }}>
                                    <span>💳</span> Payment Methods
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
            </main>
        </div>
    );
};

export default BookCharger;

