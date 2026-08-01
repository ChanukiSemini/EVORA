// ============================================
// src/pages/MyReservations.jsx
// EVORA - My Reservations Page
// Fully interactive tabs, modals, and responsive layout
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

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

const IconAlertCircle = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 7v3.5M10 13.5h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

const IconXCircle = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="2" />
        <path d="M14 14l12 12M26 14L14 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const IconReceipt = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M5 3h10v14l-2.5-1.5L10 17l-2.5-1.5L5 17V3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M8 7h4M8 10h4M8 13h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);

/* ---------- Mock Reservation Data ---------- */
const INITIAL_RESERVATIONS = {
    upcoming: [
        {
            id: '212456',
            station: 'Keels Kaduwela Bay 01',
            type: 'DC Fast Charger · 50kW',
            date: 'Oct 24, 2026',
            time: '10:30 AM',
            duration: '60 min',
            connector: 'CCS2 (DC Fast)',
            cost: 'Rs. 2,450',
            hasDetailsBtnOnly: true,
        },
        {
            id: '212457',
            station: 'Softlogic Glomark – Delkanda',
            type: 'AC Type 2 · 22kW',
            date: 'Oct 26, 2026',
            time: '02:15 PM',
            duration: '45 min',
            connector: 'Type 2 AC',
            cost: 'Rs. 1,260',
            hasDetailsBtnOnly: false,
        },
        {
            id: '212458',
            station: 'Odel Alexandra Place',
            type: 'DC Fast Charger · 120kW',
            date: 'Oct 28, 2026',
            time: '09:00 AM',
            duration: '60 min',
            connector: 'CCS2 (DC Fast)',
            cost: 'Rs. 3,200',
            hasDetailsBtnOnly: false,
        },
    ],
    completed: [
        {
            id: '212450',
            station: 'Keels Kaduwela Bay 01',
            type: 'DC Fast Charger · 50kW',
            date: 'Sep 18, 2026',
            time: '09:00 AM',
            duration: '60 min',
            cost: 'Rs. 2,450',
            energy: '28.4 kWh',
        },
        {
            id: '212449',
            station: 'Softlogic Glomark – Delkanda',
            type: 'AC Type 2 · 22kW',
            date: 'Sep 10, 2026',
            time: '11:30 AM',
            duration: '45 min',
            cost: 'Rs. 1,260',
            energy: '14.2 kWh',
        },
    ],
    cancelled: [
        {
            id: '212455',
            station: 'Softlogic Glomark – Delkanda',
            type: 'AC Type 2 · 22kW',
            date: 'Oct 26, 2026',
            time: '02:15 PM',
            cancelledDate: 'Oct 24, 2026',
        },
    ],
};

const CancelledEmptyNotice = () => (
    <div className="res-empty-state res-cancelled-empty-notice">
        <div className="res-empty-icon-red">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
        </div>
        <h3 className="res-empty-title">No more cancelled bookings</h3>
        <p className="res-empty-sub">Your cancelled reservations will appear here</p>
    </div>
);

const MyReservations = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'completed' | 'cancelled'
    const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    /* Modal states */
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [modalType, setModalType] = useState(null); // 'details' | 'cancel' | 'reschedule' | 'receipt'

    /* Cancel handler */
    const handleCancelBooking = (bookingId) => {
        const itemToCancel = reservations.upcoming.find(b => b.id === bookingId);
        if (!itemToCancel) return;

        setReservations(prev => ({
            ...prev,
            upcoming: prev.upcoming.filter(b => b.id !== bookingId),
            cancelled: [
                {
                    ...itemToCancel,
                    cancelledDate: 'Today',
                },
                ...prev.cancelled,
            ],
        }));
        setModalType(null);
    };

    /* Reschedule handler */
    const handleRescheduleBooking = (bookingId, newDate, newTime) => {
        setReservations(prev => ({
            ...prev,
            upcoming: prev.upcoming.map(b => (b.id === bookingId ? { ...b, date: newDate, time: newTime } : b)),
        }));
        setModalType(null);
    };

    /* Search filter */
    const filteredItems = reservations[activeTab].filter(item =>
        item.station.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            {/* ════════════════════════════════
                MOBILE LAYOUT (< 768px)
                ════════════════════════════════ */}
            <div className="evora-screen reservations-screen mobile-only">
                {/* Nav Header */}
                <div className="res-nav-bar">
                    <button className="nav-back" onClick={() => navigate('/')} title="Back">
                        <IconBack />
                    </button>
                    <h1 className="res-nav-title">My Reservations</h1>
                    <button className="nav-hamburger" onClick={() => setIsMobileMenuOpen(true)} title="Menu">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                            <line x1="4" y1="6" x2="20" y2="6" />
                            <line x1="4" y1="12" x2="20" y2="12" />
                            <line x1="4" y1="18" x2="20" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Tabs Row */}
                <div className="res-tabs-pill-row">
                    <button
                        className={`res-tab-pill ${activeTab === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Upcoming ({reservations.upcoming.length})
                    </button>
                    <button
                        className={`res-tab-pill ${activeTab === 'completed' ? 'active' : ''}`}
                        onClick={() => setActiveTab('completed')}
                    >
                        Completed ({reservations.completed.length})
                    </button>
                    <button
                        className={`res-tab-pill ${activeTab === 'cancelled' ? 'active' : ''}`}
                        onClick={() => setActiveTab('cancelled')}
                    >
                        Cancelled ({reservations.cancelled.length})
                    </button>
                </div>

                {/* Cards List */}
                <div className="res-cards-list">
                    {filteredItems.length === 0 ? (
                        activeTab === 'cancelled' ? (
                            <CancelledEmptyNotice />
                        ) : (
                            <div className="res-empty-state">
                                <div className="res-empty-icon">
                                    <IconXCircle />
                                </div>
                                <h3 className="res-empty-title">No {activeTab} bookings</h3>
                                <p className="res-empty-sub">Your {activeTab} reservations will appear here</p>
                            </div>
                        )
                    ) : (
                        <>
                            {filteredItems.map(b => (
                                <div key={b.id} className="res-card">
                                    {/* Top Header */}
                                    <div className="res-card-header">
                                        <div className="res-booking-id-tag">
                                            <span className="res-id-label">BOOKING ID</span>
                                            <span className="res-id-value">#{b.id}</span>
                                        </div>
                                        <span className={`res-status-badge ${activeTab}`}>
                                            <span className="res-badge-dot" />
                                            {activeTab.toUpperCase()}
                                        </span>
                                    </div>

                                {/* Station Info */}
                                <div className="res-card-body">
                                    <div className="res-station-row">
                                        <span className="res-station-icon">
                                            <IconMapPin />
                                        </span>
                                        <div className="res-station-text">
                                            <h3 className="res-station-name">{b.station}</h3>
                                            <p className="res-station-type">{b.type}</p>
                                        </div>
                                    </div>

                                    {/* Date & Time pill box */}
                                    <div className="res-datetime-box">
                                        <span className="res-datetime-item">
                                            <IconCalendar /> {b.date}
                                        </span>
                                        <span className="res-datetime-divider">|</span>
                                        <span className="res-datetime-item">
                                            <IconClock /> {b.time}
                                        </span>
                                    </div>

                                    {activeTab === 'cancelled' && b.cancelledDate && (
                                        <div className="res-cancelled-alert">
                                            <IconAlertCircle /> Cancelled on {b.cancelledDate}
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="res-card-actions">
                                    {activeTab === 'upcoming' && (
                                        b.hasDetailsBtnOnly ? (
                                            <button
                                                className="res-btn-primary-green"
                                                onClick={() => { setSelectedBooking(b); setModalType('details'); }}
                                            >
                                                Booking Details
                                            </button>
                                        ) : (
                                            <div className="res-dual-actions">
                                                <button
                                                    className="res-btn-cancel"
                                                    onClick={() => { setSelectedBooking(b); setModalType('cancel'); }}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className="res-btn-reschedule"
                                                    onClick={() => { setSelectedBooking(b); setModalType('reschedule'); }}
                                                >
                                                    Reschedule
                                                </button>
                                            </div>
                                        )
                                    )}

                                    {activeTab === 'completed' && (
                                        <button
                                            className="res-btn-receipt"
                                            onClick={() => { setSelectedBooking(b); setModalType('receipt'); }}
                                        >
                                            View Receipt <IconArrowRight />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {activeTab === 'cancelled' && <CancelledEmptyNotice />}
                    </>
                    )}
                </div>

                {activeTab === 'completed' && reservations.completed.length > 0 && (
                    <p className="res-footer-note">Showing all completed bookings</p>
                )}

                {/* Mobile Drawer Navigation */}
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
                        </div>
                    </div>
                )}
            </div>

            {/* ════════════════════════════════
                DESKTOP & TABLET LAYOUT (>= 768px)
                ════════════════════════════════ */}
            <div className="app-shell desktop-only">
                <Sidebar />

                <main className="app-main">
                    {/* Top Bar Header */}
                    <div className="dt-topbar">
                        <button className="dt-back-btn" onClick={() => navigate(-1)}>←</button>
                        <div>
                            <h1 className="dt-page-title">My Reservations</h1>
                            <p className="dt-page-subtitle">Manage and view all your EV charging sessions</p>
                        </div>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="dt-res-header-bar card">
                        <div className="dt-res-tabs">
                            <button
                                className={`dt-res-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
                                onClick={() => setActiveTab('upcoming')}
                            >
                                Upcoming <span className="tab-count">{reservations.upcoming.length}</span>
                            </button>
                            <button
                                className={`dt-res-tab ${activeTab === 'completed' ? 'active' : ''}`}
                                onClick={() => setActiveTab('completed')}
                            >
                                Completed <span className="tab-count">{reservations.completed.length}</span>
                            </button>
                            <button
                                className={`dt-res-tab ${activeTab === 'cancelled' ? 'active' : ''}`}
                                onClick={() => setActiveTab('cancelled')}
                            >
                                Cancelled <span className="tab-count">{reservations.cancelled.length}</span>
                            </button>
                        </div>

                        <div className="dt-res-search-wrap">
                            <input
                                type="text"
                                className="dt-res-search-input"
                                placeholder="Search by station or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="dt-res-grid">
                        {filteredItems.length === 0 ? (
                            activeTab === 'cancelled' ? (
                                <div className="card dt-empty-state-card" style={{ gridColumn: '1 / -1' }}>
                                    <CancelledEmptyNotice />
                                </div>
                            ) : (
                                <div className="res-empty-state dt-empty-state card" style={{ gridColumn: '1 / -1' }}>
                                    <div className="res-empty-icon">
                                        <IconXCircle />
                                    </div>
                                    <h3 className="res-empty-title">No {activeTab} bookings</h3>
                                    <p className="res-empty-sub">Your {activeTab} reservations will appear here</p>
                                </div>
                            )
                        ) : (
                            <>
                                {filteredItems.map(b => (
                                    <div key={b.id} className="res-card card dt-res-card">
                                        <div className="res-card-header">
                                            <div className="res-booking-id-tag">
                                                <span className="res-id-label">BOOKING ID</span>
                                                <span className="res-id-value">#{b.id}</span>
                                            </div>
                                            <span className={`res-status-badge ${activeTab}`}>
                                                <span className="res-badge-dot" />
                                                {activeTab.toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="res-card-body">
                                            <div className="res-station-row">
                                                <span className="res-station-icon">
                                                    <IconMapPin />
                                                </span>
                                                <div className="res-station-text">
                                                    <h3 className="res-station-name">{b.station}</h3>
                                                    <p className="res-station-type">{b.type}</p>
                                                </div>
                                            </div>

                                            <div className="res-datetime-box">
                                                <span className="res-datetime-item">
                                                    <IconCalendar /> {b.date}
                                                </span>
                                                <span className="res-datetime-divider">|</span>
                                                <span className="res-datetime-item">
                                                    <IconClock /> {b.time}
                                                </span>
                                            </div>

                                            {activeTab === 'cancelled' && b.cancelledDate && (
                                                <div className="res-cancelled-alert">
                                                    <IconAlertCircle /> Cancelled on {b.cancelledDate}
                                                </div>
                                            )}
                                        </div>

                                        <div className="res-card-actions">
                                            {activeTab === 'upcoming' && (
                                                b.hasDetailsBtnOnly ? (
                                                    <button
                                                        className="res-btn-primary-green"
                                                        onClick={() => { setSelectedBooking(b); setModalType('details'); }}
                                                    >
                                                        Booking Details
                                                    </button>
                                                ) : (
                                                    <div className="res-dual-actions">
                                                        <button
                                                            className="res-btn-cancel"
                                                            onClick={() => { setSelectedBooking(b); setModalType('cancel'); }}
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            className="res-btn-reschedule"
                                                            onClick={() => { setSelectedBooking(b); setModalType('reschedule'); }}
                                                        >
                                                            Reschedule
                                                        </button>
                                                    </div>
                                                )
                                            )}

                                            {activeTab === 'completed' && (
                                                <button
                                                    className="res-btn-receipt"
                                                    onClick={() => { setSelectedBooking(b); setModalType('receipt'); }}
                                                >
                                                    View Receipt <IconArrowRight />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {activeTab === 'cancelled' && (
                                    <div className="card dt-empty-state-card" style={{ gridColumn: '1 / -1', marginTop: 12 }}>
                                        <CancelledEmptyNotice />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>
            </div>

            {/* ════════════════════════════════
                ACTION MODALS (Details, Cancel, Reschedule, Receipt)
                ════════════════════════════════ */}
            {modalType && selectedBooking && (
                <div className="bc-modal-backdrop" onClick={() => setModalType(null)}>
                    <div className="bc-modal-card res-modal-card" onClick={(e) => e.stopPropagation()}>
                        <button className="bc-close-btn" onClick={() => setModalType(null)}>✕</button>

                        {/* Details Modal */}
                        {modalType === 'details' && (
                            <div className="res-modal-body">
                                <h3 className="res-modal-title">Booking Details</h3>
                                <p className="res-modal-subtitle">ID #{selectedBooking.id}</p>

                                <div className="bc-detail-card">
                                    <div className="bc-detail-row">
                                        <span className="bc-detail-icon bc-icon-accent"><IconMapPin /></span>
                                        <div className="bc-detail-text">
                                            <span className="bc-detail-value">{selectedBooking.station}</span>
                                            <span className="bc-detail-label">{selectedBooking.type}</span>
                                        </div>
                                    </div>
                                    <div className="bc-detail-divider" />
                                    <div className="bc-detail-row">
                                        <span className="bc-detail-icon bc-icon-cyan"><IconCalendar /></span>
                                        <div className="bc-detail-text">
                                            <span className="bc-detail-value">{selectedBooking.date} · {selectedBooking.time}</span>
                                            <span className="bc-detail-label">Date & Time</span>
                                        </div>
                                    </div>
                                    <div className="bc-detail-divider" />
                                    <div className="bc-detail-row">
                                        <span className="bc-detail-icon bc-icon-amber"><IconClock /></span>
                                        <div className="bc-detail-text">
                                            <span className="bc-detail-value">{selectedBooking.duration || '60 min'}</span>
                                            <span className="bc-detail-label">Estimated Duration</span>
                                        </div>
                                    </div>
                                </div>

                                <button className="btn-primary" onClick={() => setModalType(null)} style={{ marginTop: 20 }}>
                                    Done
                                </button>
                            </div>
                        )}

                        {/* Cancel Modal */}
                        {modalType === 'cancel' && (
                            <div className="res-modal-body">
                                <div className="res-cancel-icon-wrap">
                                    <IconAlertCircle />
                                </div>
                                <h3 className="res-modal-title">Cancel Reservation?</h3>
                                <p className="res-modal-subtitle">
                                    Are you sure you want to cancel booking <strong>#{selectedBooking.id}</strong> at {selectedBooking.station}?
                                </p>
                                <div className="res-modal-button-row">
                                    <button className="btn-secondary" onClick={() => setModalType(null)}>
                                        Keep Booking
                                    </button>
                                    <button
                                        className="btn-danger"
                                        onClick={() => handleCancelBooking(selectedBooking.id)}
                                    >
                                        Yes, Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Reschedule Modal */}
                        {modalType === 'reschedule' && (
                            <div className="res-modal-body">
                                <h3 className="res-modal-title">Reschedule Booking</h3>
                                <p className="res-modal-subtitle">Select a new date and time for #{selectedBooking.id}</p>

                                <div className="res-reschedule-inputs">
                                    <label className="res-input-group">
                                        <span>New Date</span>
                                        <input type="date" className="res-date-input" defaultValue="2026-11-01" id="res-new-date" />
                                    </label>
                                    <label className="res-input-group">
                                        <span>New Time Slot</span>
                                        <select className="res-select-input" defaultValue="11:00 AM" id="res-new-time">
                                            <option value="09:00 AM">09:00 AM</option>
                                            <option value="11:00 AM">11:00 AM</option>
                                            <option value="01:30 PM">01:30 PM</option>
                                            <option value="04:00 PM">04:00 PM</option>
                                        </select>
                                    </label>
                                </div>

                                <div className="res-modal-button-row" style={{ marginTop: 20 }}>
                                    <button className="btn-secondary" onClick={() => setModalType(null)}>
                                        Back
                                    </button>
                                    <button
                                        className="btn-primary"
                                        onClick={() => {
                                            const d = document.getElementById('res-new-date')?.value || 'Nov 01, 2026';
                                            const t = document.getElementById('res-new-time')?.value || '11:00 AM';
                                            handleRescheduleBooking(selectedBooking.id, d, t);
                                        }}
                                    >
                                        Confirm Reschedule
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Receipt Modal */}
                        {modalType === 'receipt' && (
                            <div className="res-modal-body">
                                <div className="res-receipt-icon-wrap">
                                    <IconReceipt />
                                </div>
                                <h3 className="res-modal-title">Charging Receipt</h3>
                                <p className="res-modal-subtitle">Invoice ID #{selectedBooking.id}</p>

                                <div className="res-receipt-box">
                                    <div className="res-receipt-row">
                                        <span>Station</span>
                                        <span>{selectedBooking.station}</span>
                                    </div>
                                    <div className="res-receipt-row">
                                        <span>Date & Time</span>
                                        <span>{selectedBooking.date} {selectedBooking.time}</span>
                                    </div>
                                    <div className="res-receipt-row">
                                        <span>Energy Delivered</span>
                                        <span>{selectedBooking.energy || '24.5 kWh'}</span>
                                    </div>
                                    <div className="res-receipt-row">
                                        <span>Duration</span>
                                        <span>{selectedBooking.duration || '45 min'}</span>
                                    </div>
                                    <div className="card-divider" />
                                    <div className="res-receipt-row total">
                                        <span>Total Paid</span>
                                        <span className="res-receipt-total-val">{selectedBooking.cost}</span>
                                    </div>
                                </div>

                                <button className="btn-primary" onClick={() => setModalType(null)} style={{ marginTop: 20 }}>
                                    Close Receipt
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default MyReservations;
