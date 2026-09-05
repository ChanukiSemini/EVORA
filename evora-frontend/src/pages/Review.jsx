// ============================================
// src/pages/Review.jsx
// EVORA - Rate Your Charging Session Page
// ============================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import IconSprite from '../components/IconSprite';
import Icon from '../components/Icon.jsx';
import chargingStationImg from '../assets/charging-station.png';

/* ---------- Mock Data ---------- */
const STATION = {
    name: 'Voltex Supercharge Hub',
    rating: '4.8',
    address: '452 Tesla Parkway, Suite 100, Innovation District, Austin, TX 78701',
    summary: [
        { label: 'Connector', value: 'CCS Combo 2 (350 kW)' },
        { label: 'Date & Time', value: 'Jul 10, 2026 • 11:32 AM' },
        { label: 'Energy Delivered', value: '48.6 kWh' },
        { label: 'Cost', value: '$21.87' },
    ],
};

// TEMPORARY: hardcoded for backend testing only.
// Once "My Bookings" is built, this will come from route params/state instead.
const TEMP_BOOKING_ID = '65f200000000000000000005';

const AVAILABLE_CHIPS = ['Fast Charging', 'Easy to Find', 'Clean Station', 'Friendly Staff', 'Faulty Charger'];

const STATION_IMAGE_FALLBACK_SVG =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"><rect width="800" height="400" fill="%2302141C"/><path d="M400 150 L430 210 L370 210 Z" fill="%233DDC97"/><text x="400" y="260" font-family="sans-serif" font-size="20" fill="%2390AFB7" text-anchor="middle">Station Charger Details</text></svg>';

const USER = { name: 'Sarah Jenkins', email: 'sarah.j@evora-charge.com' };

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

export default function Review() {
    const navigate = useNavigate();

    // ── Layout state ──
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // ── Station image state ──
    const [imgSrc, setImgSrc] = useState(chargingStationImg);
    const handleImageError = () => setImgSrc(STATION_IMAGE_FALLBACK_SVG);

    // ── Booking details state fetched from backend ──
    const [bookingData, setBookingData] = useState(null);
    const [isLoadingBooking, setIsLoadingBooking] = useState(true);
    const [bookingError, setBookingError] = useState(null);

    // ── Review form state ──
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [selectedChips, setSelectedChips] = useState([]);
    const [comment, setComment] = useState('');
    const [photos, setPhotos] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [ratingError, setRatingError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // Fetch booking & station details on mount using TEMP_BOOKING_ID
    useEffect(() => {
        const fetchBookingDetails = async () => {
            setIsLoadingBooking(true);
            setBookingError(null);
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const response = await fetch(`${apiUrl}/api/bookings/${TEMP_BOOKING_ID}`);
                if (!response.ok) {
                    throw new Error('Failed to load booking');
                }
                const data = await response.json();
                setBookingData(data);
            } catch (err) {
                console.error('Error fetching booking details:', err);
                setBookingError('Failed to load booking');
            } finally {
                setIsLoadingBooking(false);
            }
        };

        fetchBookingDetails();
    }, []);

    // Revoke object URLs on unmount
    useEffect(() => {
        return () => {
            photos.forEach((item) => { if (item.previewUrl) URL.revokeObjectURL(item.previewUrl); });
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleStarClick = (e, value) => {
        e.preventDefault();
        e.stopPropagation();
        setRating(value);
        setRatingError(null);
    };

    const handleChipToggle = (chip) => {
        setSelectedChips((prev) =>
            prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
        );
    };

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const newPhotos = files.map((file) => ({
            id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
            file,
            previewUrl: URL.createObjectURL(file),
        }));
        setPhotos((prev) => [...prev, ...newPhotos]);
        e.target.value = '';
    };

    const handleRemovePhoto = (id, previewUrl) => {
        URL.revokeObjectURL(previewUrl);
        setPhotos((prev) => prev.filter((p) => p.id !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setRatingError('Please select a star rating before submitting.');
            return;
        }
        setIsSubmitting(true);
        setSubmitError(null);

        // TODO: image upload not implemented yet — excluded from payload
        const payload = {
            booking: TEMP_BOOKING_ID,
            driver: bookingData?.driver?._id || bookingData?.driver,
            station: bookingData?.charger?.station?._id || bookingData?.charger?.station,
            rating,
            ratingLabel: RATING_LABELS[rating] || '',
            chips: selectedChips,
            comment: comment.trim(),
        };

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setIsSubmitted(true);
            } else {
                setSubmitError(data.message || 'Failed to submit review. Please try again.');
            }
        } catch (err) {
            console.error('Error submitting review:', err);
            setSubmitError('Unable to connect to backend server. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        photos.forEach((item) => URL.revokeObjectURL(item.previewUrl));
        setRating(0);
        setHoverRating(0);
        setSelectedChips([]);
        setComment('');
        setPhotos([]);
        setIsSubmitted(false);
        setIsSubmitting(false);
        setRatingError(null);
        setSubmitError(null);
    };

    const activeRating = hoverRating || rating;

    // Derived station and summary values from fetched bookingData or fallbacks
    const stationName = bookingData?.charger?.station?.name || 'Charging Station';
    const stationRating = bookingData?.charger?.station?.rating || '4.8';
    const stationAddress = bookingData?.charger?.station?.address || 'Address unavailable';

    const summaryItems = bookingData ? [
        { label: 'Connector', value: `${bookingData.charger?.connector?.connectorType || 'CCS Combo 2'} (${bookingData.charger?.connector?.powerKW || 150} kW)` },
        { label: 'Date & Time', value: `${bookingData.date || ''} • ${bookingData.time || ''}` },
        { label: 'Vehicle', value: bookingData.vehicle?.name || 'EV Vehicle' },
        { label: 'Energy Delivered', value: `${bookingData.energyDeliveredKWh ? bookingData.energyDeliveredKWh + ' kWh' : '14.2 kWh'}` },
        { label: 'Cost', value: `Rs. ${bookingData.estimatedTotalCost ? bookingData.estimatedTotalCost.toLocaleString() : '0'}` },
    ] : [];

    /* ---------- Shared sub-components ---------- */
    const reviewContentBlock = (
        <div className="review-page-layout">
            {/* ── Station Summary Card ── */}
            <section className="card station-card animate-card">
                <div className="station-image-container">
                    <img
                        id="station-hero-image"
                        src={imgSrc}
                        alt="EV Charging Station"
                        onError={handleImageError}
                    />
                </div>
                <div className="station-details">
                    {isLoadingBooking ? (
                        <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading booking details...</div>
                    ) : bookingError ? (
                        <div style={{ padding: '20px', color: '#ff6b6b' }}>Failed to load booking details</div>
                    ) : (
                        <>
                            <div>
                                <div className="station-header">
                                    <h2 className="station-name">{stationName}</h2>
                                    <span className="rating-badge">
                                        <Icon name="icon-star-act" size={12} style={{ fill: 'currentColor', verticalAlign: 'middle', marginRight: 3 }} />
                                        {stationRating}
                                    </span>
                                </div>
                                <p className="station-address">{stationAddress}</p>
                            </div>
                            <div className="booking-summary-grid">
                                {summaryItems.map((item) => (
                                    <div className="summary-item" key={item.label}>
                                        <span className="summary-label">{item.label}</span>
                                        <span className="summary-value">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* ── Review Form / Success State ── */}
            {isSubmitted ? (
                <div className="card review-form-card success-card animate-card" style={{ animationDelay: '70ms' }}>
                    <div className="success-icon-container">
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <h3 className="success-title">Review Submitted!</h3>
                    <p className="success-subtitle">Thank you for your feedback — it helps improve charging experiences for everyone.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '280px' }}>
                        <button className="btn-primary" onClick={handleReset}>Done</button>
                        <button className="btn-secondary" type="button" onClick={handleReset}>Submit Another Review</button>
                    </div>
                </div>
            ) : (
                <div className="card review-form-card animate-card" style={{ animationDelay: '70ms' }}>
                    {/* Section header */}
                    <div className="review-form-header">
                        <div className="review-form-header__icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="review-form-header__title">Rate Your Experience</h3>
                            <p className="review-form-header__sub">Share what made this session great (or not)</p>
                        </div>
                    </div>

                    <div className="card-divider" />

                    <form onSubmit={handleSubmit} noValidate>
                        {/* Star Rating */}
                        <div className="review-section-block">
                            <label className="review-section-label" id="star-rating-label">Overall Rating</label>
                            <div className="stars-container" role="radiogroup" aria-labelledby="star-rating-label">
                                {[1, 2, 3, 4, 5].map((index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={index <= activeRating ? 'star-interactive filled' : 'star-interactive'}
                                        onClick={(e) => handleStarClick(e, index)}  // ← Pass event
                                        onMouseEnter={() => setHoverRating(index)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        aria-label={`Rate ${index} out of 5 stars`}
                                        role="radio"
                                        aria-checked={rating === index}
                                    >
                                        <Icon
                                            name="icon-star-act"
                                            size={36}
                                            style={{
                                                color: index <= activeRating ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                                fill: index <= activeRating ? 'currentColor' : 'none',
                                                transition: 'color 0.15s, fill 0.15s',
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                            {activeRating > 0 && (
                                <span className="rating-label-text">{RATING_LABELS[activeRating]}</span>
                            )}
                            {ratingError && (
                                <div className="error-message" role="alert">
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    <span>{ratingError}</span>
                                </div>
                            )}
                        </div>

                        <div className="card-divider" />

                        {/* Chips */}
                        <div className="review-section-block">
                            <label className="review-section-label">What went well or could be improved?</label>
                            <div className="review-chips-container">
                                {AVAILABLE_CHIPS.map((chip) => (
                                    <button
                                        key={chip}
                                        type="button"
                                        className={selectedChips.includes(chip) ? 'chip active' : 'chip'}
                                        onClick={() => handleChipToggle(chip)}
                                        aria-pressed={selectedChips.includes(chip)}
                                    >
                                        {chip}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="card-divider" />

                        {/* Comment */}
                        <div className="review-section-block">
                            <label htmlFor="comment-text" className="review-section-label">Additional Comments</label>
                            <textarea
                                id="comment-text"
                                className="comment-input"
                                placeholder="Describe your experience — charging speed, accessibility, cable quality..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                maxLength={1000}
                            />
                            <span className="comment-char-count">{comment.length} / 1000</span>
                        </div>

                        <div className="card-divider" />

                        {/* Photo Upload */}
                        <div className="review-section-block">
                            <label className="review-section-label">
                                Upload Photos <span className="review-section-label--optional">(optional)</span>
                            </label>
                            <div className="photo-upload-wrapper">
                                <div className="photo-upload-btn-container">
                                    <input
                                        type="file"
                                        className="photo-upload-input"
                                        id="photo-file"
                                        accept="image/*"
                                        multiple
                                        onChange={handlePhotoChange}
                                        aria-label="Upload charging station photos"
                                    />
                                    <div className="photo-upload-btn" aria-hidden="true">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                            <circle cx="12" cy="13" r="4" />
                                        </svg>
                                        <span>Add Photo</span>
                                    </div>
                                </div>
                                {photos.map((item) => (
                                    <div key={item.id} className="thumbnail-preview">
                                        <img src={item.previewUrl} alt="Thumbnail preview" />
                                        <button
                                            type="button"
                                            className="remove-photo-btn"
                                            onClick={() => handleRemovePhoto(item.id, item.previewUrl)}
                                            aria-label="Remove this photo"
                                        >
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {submitError && (
                            <div className="error-message" role="alert" style={{ marginTop: '12px' }}>
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <span>{submitError}</span>
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="btn-primary" 
                            style={{ marginTop: '12px' }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );

    return (
        <>
            <IconSprite />

            {/* ════════════════════════════════
                MOBILE LAYOUT (hidden ≥ 768px)
                ════════════════════════════════ */}
            <div className="evora-screen mobile-only">
                <div className="nav-bar">
                    <button className="nav-back" onClick={() => navigate(-1)} title="Back">←</button>
                    <span className="nav-title">Rate Your Session</span>
                    <button className="nav-hamburger" onClick={() => setIsMobileMenuOpen(true)} title="Menu">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                            <line x1="4" y1="6" x2="20" y2="6" />
                            <line x1="4" y1="12" x2="20" y2="12" />
                            <line x1="4" y1="18" x2="20" y2="18" />
                        </svg>
                    </button>
                </div>

                {reviewContentBlock}

                {/* Mobile Navigation Drawer Overlay */}
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
                                <div className="mobile-menu-item" onClick={() => { navigate('/find'); setIsMobileMenuOpen(false); }}>
                                    <span>🔍</span> Find Charging Stations
                                </div>
                                <div className="mobile-menu-item" onClick={() => { navigate('/book-charger'); setIsMobileMenuOpen(false); }}>
                                    <span>⚡</span> Book a Charger
                                </div>
                                <div className="mobile-menu-item" onClick={() => { navigate('/bookings'); setIsMobileMenuOpen(false); }}>
                                    <span>📅</span> My Bookings
                                </div>
                                <div className="mobile-menu-item active" onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}>
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
                                    <div className="mobile-user-avatar" onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }} role="button" tabIndex={0}>SJ</div>
                                    <div className="mobile-user-info">
                                        <span className="mobile-user-name">{USER.name}</span>
                                        <span className="mobile-user-email">{USER.email}</span>
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
                            <h1 className="dt-page-title">Rate Your Charging Session</h1>
                            <p className="dt-page-subtitle">Share your experience at {STATION.name}</p>
                        </div>
                    </div>
                    <div className="dt-content">
                        {reviewContentBlock}
                    </div>
                </main>
            </div>
        </>
    );
}
