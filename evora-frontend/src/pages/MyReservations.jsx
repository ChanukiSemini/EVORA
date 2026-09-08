// ============================================
// src/pages/MyReservations.jsx
// EVORA - My Reservations Page
// Tabs: All / Upcoming / Completed / Cancelled
// Real booking data from /api/bookings/driver/:id, enriched with
// resolvedStatus and canReschedule from the backend.
// ============================================

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import CancelBookingModal from '../components/CancelBookingModal';

// ─────────────────────────────────────────────
// API — kept local (no shared api.js)
// ─────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper to resolve the active driver ID from localStorage or fallback
const getActiveDriverId = () => {
    try {
        const userObj = JSON.parse(
            localStorage.getItem('evora_current_user') ||
            localStorage.getItem('evora_driver_user') ||
            '{}'
        );
        if (userObj._id || userObj.id) {
            return userObj._id || userObj.id;
        }
    } catch {
        // ignore
    }
    return '6a9ecddc103ad8f044455e39';
};

/**
 * Fetch all bookings for a driver, with optional status filter.
 * The backend attaches `resolvedStatus` and `canReschedule` to each record.
 */
async function getDriverBookings(driverId, status = 'all') {
    const res = await fetch(`${BASE_URL}/api/bookings/driver/${driverId}?status=${status}`);
    if (!res.ok) throw new Error('Failed to load bookings');
    return res.json();
}

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

const IconStar = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2l2.4 5.3 5.8.5-4.4 3.9 1.3 5.7L10 14.4l-5.1 3 1.3-5.7-4.4-3.9 5.8-.5L10 2z" />
    </svg>
);

/* ---------- Shared empty state components ---------- */

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

/* ---------- Upcoming Card Actions ---------- */
// Allows viewing details and cancellation (if > 1 hr to session)
const UpcomingCardActions = ({ booking, onDetails, onCancel }) => {
    const canModify = booking.canReschedule !== false;

    return (
        <div className="res-upcoming-actions-wrap">
            <button
                className="res-btn-primary-green"
                onClick={() => onDetails(booking)}
            >
                Booking Details
            </button>

            <div className="res-secondary-actions-row">
                <button
                    className={`res-btn-secondary-action res-btn-cancel-sub ${!canModify ? 'disabled' : ''}`}
                    onClick={() => canModify && onCancel(booking)}
                    disabled={!canModify}
                    title={!canModify ? 'Cancellation closes 1 hour before your session' : 'Cancel reservation'}
                >
                    Cancel
                </button>
            </div>

            {!canModify && (
                <div className="res-policy-notice">
                    <IconAlertCircle /> Cancellation locked (&lt; 1 hr to session)
                </div>
            )}
        </div>
    );
};

const MyReservations = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('all'); // 'all' | 'upcoming' | 'completed' | 'cancelled'
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    /* Fetched bookings — full list so tab counts and category switches are instantaneous */
    const [allBookings, setAllBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    /* Modal states */
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [modalType, setModalType] = useState(null); // 'details' | 'cancel' | 'receipt'

    const fetchBookings = () => {
        setIsLoading(true);
        setLoadError(null);
        const driverId = getActiveDriverId();
        getDriverBookings(driverId, 'all')
            .then((data) => {
                setAllBookings(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch bookings in MyReservations:', err);
                setLoadError(err.message);
                setIsLoading(false);
            });
    };

    /* Fetch bookings on mount and whenever tab changes */
    useEffect(() => {
        fetchBookings();
    }, []);

    /* Counts per category — derived from allBookings */
    const counts = useMemo(() => ({
        all: allBookings.length,
        upcoming: allBookings.filter(b => b.resolvedStatus === 'upcoming').length,
        completed: allBookings.filter(b => b.resolvedStatus === 'completed').length,
        cancelled: allBookings.filter(b => b.resolvedStatus === 'cancelled').length,
    }), [allBookings]);

    /* Local search and tab filter on top of the full result */
    const filteredItems = useMemo(() => {
        const tabList = activeTab === 'all'
            ? allBookings
            : allBookings.filter(b => b.resolvedStatus === activeTab);

        if (!searchQuery.trim()) return tabList;
        const q = searchQuery.toLowerCase();
        return tabList.filter((b) => {
            const stationName = b.station?.name || b.stationName || b.charger?.station?.name || '';
            const bookingNum = b.bookingNumber || b._id || '';
            return (
                stationName.toLowerCase().includes(q) ||
                String(bookingNum).toLowerCase().includes(q)
            );
        });
    }, [allBookings, activeTab, searchQuery]);

    /* Cancel handler — updates status to cancelled and frees slot */
    const handleCancelBooking = async (bookingId) => {
        try {
            const res = await fetch(`${BASE_URL}/api/bookings/${bookingId}/cancel`, {
                method: 'PATCH',
            });

            if (!res.ok) {
                throw new Error('Failed to cancel booking');
            }

            const updatedBooking = await res.json();

            // Update this booking in state to 'cancelled' so it moves to the Cancelled tab
            setAllBookings(prev =>
                prev.map(b =>
                    (b._id === bookingId || b.id === bookingId)
                        ? {
                            ...b,
                            status: 'cancelled',
                            resolvedStatus: 'cancelled',
                            cancelledDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                            canReschedule: false,
                        }
                        : b
                )
            );

            setModalType(null);
        } catch (error) {
            console.error('Cancel booking failed:', error.message);
        }
    };

    /* Card Renderer helper */
    const renderCard = (b) => {
        // Use resolvedStatus (real-time, computed by backend) for display.
        const currentStatus = b.resolvedStatus || b.status;

        // Derive display values from station / booking details
        const stationName = b.station?.name || b.stationName || b.charger?.station?.name || 'Unknown Station';
        const connectorLabel = b.connectorType || b.bayName || b.charger?.connector?.label || b.charger?.connector?.specs || (
            b.charger?.connector?.connectorType
                ? `${b.charger.connector.connectorType} · ${b.charger.connector.powerKW || b.charger.powerKW || '?'}kW`
                : b.charger?.connectorType
                ? `${b.charger.connectorType} · ${b.charger.powerKW || '?'}kW`
                : 'Charger'
        );
        const displayDuration = b.durationMinutes ? `${b.durationMinutes} min` : null;
        const displayCost = b.estimatedTotalCost
            ? (typeof b.estimatedTotalCost === 'number' ? `Rs. ${b.estimatedTotalCost.toLocaleString()}` : String(b.estimatedTotalCost))
            : null;
        const displayEnergy = b.energyDeliveredKWh != null ? `${b.energyDeliveredKWh} kWh` : null;
        const displayId = b.bookingNumber || b._id || b.id;

        return (
            <div key={b._id || b.id} className="res-card card dt-res-card">
                <div className="res-card-header">
                    <div className="res-booking-id-tag">
                        <span className="res-id-label">BOOKING ID</span>
                        <span className="res-id-value">#{displayId}</span>
                    </div>
                    <span className={`res-status-badge ${currentStatus}`}>
                        <span className="res-badge-dot" />
                        {currentStatus.toUpperCase()}
                    </span>
                </div>

                <div className="res-card-body">
                    <div className="res-station-row">
                        <span className="res-station-icon">
                            <IconMapPin />
                        </span>
                        <div className="res-station-text">
                            <h3 className="res-station-name">{stationName}</h3>
                            <p className="res-station-type">{connectorLabel}</p>
                        </div>
                    </div>

                    <div className="res-datetime-box">
                        <span className="res-datetime-item">
                            <IconCalendar /> {b.date}
                        </span>
                        <span className="res-datetime-divider">|</span>
                        <span className="res-datetime-item">
                            <IconClock /> {b.time || b.timeSlot}
                        </span>
                    </div>

                    {currentStatus === 'cancelled' && b.cancelledDate && (
                        <div className="res-cancelled-alert">
                            <IconAlertCircle /> Cancelled on {b.cancelledDate}
                        </div>
                    )}
                </div>

                <div className="res-card-actions">
                    {currentStatus === 'upcoming' && (
                        <UpcomingCardActions
                            booking={b}
                            onDetails={(item) => navigate(`/booking-details/${item._id || item.id}`)}
                            onCancel={(item) => { setSelectedBooking(item); setModalType('cancel'); }}
                        />
                    )}

                    {currentStatus === 'completed' && (
                        <div className="res-completed-actions-wrap">
                            <button
                                className="res-btn-primary-green"
                                onClick={() => navigate('/review', { state: { bookingId: b._id } })}
                            >
                                <IconStar /> Rate Session
                            </button>
                            <button
                                className="res-btn-receipt"
                                onClick={() => { setSelectedBooking(b); setModalType('receipt'); }}
                            >
                                View Receipt <IconArrowRight />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    /* Shared loading / error / empty states */
    const renderListBody = () => {
        if (isLoading) {
            return (
                <div className="res-empty-state">
                    <p style={{ color: 'var(--text-secondary)' }}>Loading reservations…</p>
                </div>
            );
        }
        if (loadError) {
            return (
                <div className="res-empty-state">
                    <p style={{ color: '#ff6b6b' }}>{loadError}</p>
                    <button className="res-btn-primary-green" style={{ marginTop: 12 }} onClick={() => window.location.reload()}>
                        Retry
                    </button>
                </div>
            );
        }
        if (filteredItems.length === 0) {
            return activeTab === 'cancelled'
                ? <CancelledEmptyNotice />
                : (
                    <div className="res-empty-state">
                        <div className="res-empty-icon"><IconXCircle /></div>
                        <h3 className="res-empty-title">No {activeTab} bookings</h3>
                        <p className="res-empty-sub">Your {activeTab} reservations will appear here</p>
                    </div>
                );
        }
        return filteredItems.map(renderCard);
    };

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

                {/* Filter Tabs Row */}
                <div className="res-tabs-pill-row res-tabs-four">
                    <button
                        className={`res-tab-pill ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All{counts.all != null ? ` (${counts.all})` : ''}
                    </button>
                    <button
                        className={`res-tab-pill ${activeTab === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Upcoming{counts.upcoming != null ? ` (${counts.upcoming})` : ''}
                    </button>
                    <button
                        className={`res-tab-pill ${activeTab === 'completed' ? 'active' : ''}`}
                        onClick={() => setActiveTab('completed')}
                    >
                        Completed{counts.completed != null ? ` (${counts.completed})` : ''}
                    </button>
                    <button
                        className={`res-tab-pill ${activeTab === 'cancelled' ? 'active' : ''}`}
                        onClick={() => setActiveTab('cancelled')}
                    >
                        Cancelled{counts.cancelled != null ? ` (${counts.cancelled})` : ''}
                    </button>
                </div>

                {/* Cards List */}
                <div className="res-cards-list">
                    {renderListBody()}
                </div>

                {activeTab === 'completed' && counts.completed > 0 && (
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
                                <div className="mobile-menu-item" onClick={() => { navigate('/vehicles'); setIsMobileMenuOpen(false); }}>
                                    <span>🚗</span> My Vehicles
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
                                className={`dt-res-tab ${activeTab === 'all' ? 'active' : ''}`}
                                onClick={() => setActiveTab('all')}
                            >
                                All {counts.all != null && <span className="tab-count">{counts.all}</span>}
                            </button>
                            <button
                                className={`dt-res-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
                                onClick={() => setActiveTab('upcoming')}
                            >
                                Upcoming {counts.upcoming != null && <span className="tab-count">{counts.upcoming}</span>}
                            </button>
                            <button
                                className={`dt-res-tab ${activeTab === 'completed' ? 'active' : ''}`}
                                onClick={() => setActiveTab('completed')}
                            >
                                Completed {counts.completed != null && <span className="tab-count">{counts.completed}</span>}
                            </button>
                            <button
                                className={`dt-res-tab ${activeTab === 'cancelled' ? 'active' : ''}`}
                                onClick={() => setActiveTab('cancelled')}
                            >
                                Cancelled {counts.cancelled != null && <span className="tab-count">{counts.cancelled}</span>}
                            </button>
                        </div>

                        <div className="dt-res-search-wrap">
                            <input
                                type="text"
                                className="dt-res-search-input"
                                placeholder="Search by station or booking ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="dt-res-grid">
                        {isLoading ? (
                            <div className="res-empty-state dt-empty-state card" style={{ gridColumn: '1 / -1' }}>
                                <p style={{ color: 'var(--text-secondary)' }}>Loading reservations…</p>
                            </div>
                        ) : loadError ? (
                            <div className="res-empty-state dt-empty-state card" style={{ gridColumn: '1 / -1' }}>
                                <p style={{ color: '#ff6b6b' }}>{loadError}</p>
                                <button className="res-btn-primary-green" style={{ marginTop: 12 }} onClick={() => window.location.reload()}>Retry</button>
                            </div>
                        ) : filteredItems.length === 0 ? (
                            activeTab === 'cancelled' ? (
                                <div className="card dt-empty-state-card" style={{ gridColumn: '1 / -1' }}>
                                    <CancelledEmptyNotice />
                                </div>
                            ) : (
                                <div className="res-empty-state dt-empty-state card" style={{ gridColumn: '1 / -1' }}>
                                    <div className="res-empty-icon"><IconXCircle /></div>
                                    <h3 className="res-empty-title">No {activeTab} bookings</h3>
                                    <p className="res-empty-sub">Your {activeTab} reservations will appear here</p>
                                </div>
                            )
                        ) : (
                            filteredItems.map(renderCard)
                        )}
                    </div>
                </main>
            </div>

            {modalType === 'cancel' && selectedBooking && (
                <CancelBookingModal
                    booking={selectedBooking}
                    onClose={() => setModalType(null)}
                    onConfirmCancel={() => handleCancelBooking(selectedBooking._id || selectedBooking.id)}
                />
            )}

            {modalType && modalType !== 'cancel' && selectedBooking && (
                <div className="bc-modal-backdrop" onClick={() => setModalType(null)}>
                    <div className="bc-modal-card res-modal-card" onClick={(e) => e.stopPropagation()}>
                        <button className="bc-close-btn" onClick={() => setModalType(null)}>✕</button>

                        {/* Details Modal */}
                        {modalType === 'details' && (() => {
                            const sb = selectedBooking;
                            const sbStation = sb.charger?.station?.name || 'Unknown Station';
                            const sbConnector = sb.charger?.connector?.connectorType || sb.charger?.connectorType || 'Charger';
                            const sbDuration = sb.durationMinutes ? `${sb.durationMinutes} min` : '—';
                            return (
                                <div className="res-modal-body">
                                    <h3 className="res-modal-title">Booking Details</h3>
                                    <p className="res-modal-subtitle">ID #{sb.bookingNumber || sb._id}</p>

                                    <div className="bc-detail-card">
                                        <div className="bc-detail-row">
                                            <span className="bc-detail-icon bc-icon-accent"><IconMapPin /></span>
                                            <div className="bc-detail-text">
                                                <span className="bc-detail-value">{sbStation}</span>
                                                <span className="bc-detail-label">{sbConnector}</span>
                                            </div>
                                        </div>
                                        <div className="bc-detail-divider" />
                                        <div className="bc-detail-row">
                                            <span className="bc-detail-icon bc-icon-cyan"><IconCalendar /></span>
                                            <div className="bc-detail-text">
                                                <span className="bc-detail-value">{sb.date} · {sb.time || sb.timeSlot}</span>
                                                <span className="bc-detail-label">Date & Time</span>
                                            </div>
                                        </div>
                                        <div className="bc-detail-divider" />
                                        <div className="bc-detail-row">
                                            <span className="bc-detail-icon bc-icon-amber"><IconClock /></span>
                                            <div className="bc-detail-text">
                                                <span className="bc-detail-value">{sbDuration}</span>
                                                <span className="bc-detail-label">Estimated Duration</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="btn-primary" onClick={() => setModalType(null)} style={{ marginTop: 20 }}>
                                        Done
                                    </button>
                                </div>
                            );
                        })()}

                        {/* Receipt Modal */}
                        {modalType === 'receipt' && (() => {
                            const sb = selectedBooking;
                            const sbStation = sb.charger?.station?.name || 'Unknown Station';
                            const sbEnergy = sb.energyDeliveredKWh != null ? `${sb.energyDeliveredKWh} kWh` : '—';
                            const sbDuration = sb.durationMinutes ? `${sb.durationMinutes} min` : '—';
                            const sbCost = sb.estimatedTotalCost != null ? `Rs. ${sb.estimatedTotalCost.toLocaleString()}` : '—';
                            return (
                                <div className="res-modal-body">
                                    <div className="res-receipt-icon-wrap"><IconReceipt /></div>
                                    <h3 className="res-modal-title">Charging Receipt</h3>
                                    <p className="res-modal-subtitle">Booking #{sb.bookingNumber || sb._id}</p>

                                    <div className="res-receipt-box">
                                        <div className="res-receipt-row">
                                            <span>Station</span>
                                            <span>{sbStation}</span>
                                        </div>
                                        <div className="res-receipt-row">
                                            <span>Date & Time</span>
                                            <span>{sb.date} {sb.time || sb.timeSlot}</span>
                                        </div>
                                        <div className="res-receipt-row">
                                            <span>Energy Delivered</span>
                                            <span>{sbEnergy}</span>
                                        </div>
                                        <div className="res-receipt-row">
                                            <span>Duration</span>
                                            <span>{sbDuration}</span>
                                        </div>
                                        <div className="card-divider" />
                                        <div className="res-receipt-row total">
                                            <span>Total Paid</span>
                                            <span className="res-receipt-total-val">{sbCost}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 20 }}>
                                        <button
                                            className="btn-primary"
                                            onClick={() => {
                                                setModalType(null);
                                                navigate('/rate-session', { state: { bookingId: sb._id } });
                                            }}
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                        >
                                            <IconStar /> Rate Session
                                        </button>
                                        <button className="res-btn-receipt" onClick={() => setModalType(null)}>
                                            Close Receipt
                                        </button>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}
        </>
    );
};

export default MyReservations;
