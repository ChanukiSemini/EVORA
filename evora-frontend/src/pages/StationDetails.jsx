// ============================================
// src/pages/StationDetails.jsx
// Station Details page, reached from the Home
// page's "Details" button (/station/:id).
// Supports live bay selection managed by host/admin.
// ============================================

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';
import StationGallery from '../components/StationGallery';
import { STATIONS } from '../data/stations';
import { getDirectionsUrl } from '../utils/directions';
import {
    IconBack, IconMenu, IconPin, IconStarFilled, IconPlug, IconClock,
    IconNav, IconCheck, IconCard, IconBolt, IconParkingP, IconCarModel,
} from '../components/Icons';
import { AMENITY_ICONS, AMENITY_LABELS } from '../data/amenities';

const StatusBar = ({ station }) => {
    if (station.status === 'full' || station.status === 'offline') {
        return <div className="sd-avail-bar full"><span className="fs-map-legend-dot full" /> Full / Offline — no bays available right now</div>;
    }
    if (station.status === 'soon' || station.status === 'maintenance') {
        return <div className="sd-avail-bar soon"><span className="fs-map-legend-dot soon" /> Maintenance / Limited · {station.openHours}</div>;
    }
    return <div className="sd-avail-bar"><span className="fs-map-legend-dot available" /> Available Now · {station.openHours}</div>;
};

// Normalize bays data from station model / API
const getNormalizedBays = (station) => {
    if (!station) return [];
    if (station.baysDetail && station.baysDetail.length > 0) {
        return station.baysDetail.map((b, idx) => {
            const isSlow = idx >= 2 || b.type?.toLowerCase().includes('type 2');
            const status = b.status || 'available';
            const label = b.label || (status === 'available' ? 'Available' : status === 'maintenance' || status === 'faulty' ? 'Maintenance' : status === 'occupied' ? 'Occupied' : 'Unavailable');
            return {
                id: b.bayId || b.id || `bay-${idx + 1}`,
                bayId: b.bayId || b.id || `bay-${idx + 1}`,
                name: b.name || `Bay ${idx + 1}`,
                status,
                label,
                type: b.type || (isSlow ? 'Type 2' : 'CCS2'),
                power: b.power || (isSlow ? '22kW' : '150kW'),
                ratePerHour: b.ratePerHour || (isSlow ? (station.rates?.slow ? station.rates.slow * 40 : 1680) : (station.rates?.fast ? station.rates.fast * 50 : 2450)),
                portId: b.portId,
                chargerId: b.chargerId,
            };
        });
    }

    if (station.bays && Array.isArray(station.bays)) {
        return station.bays.map((st, idx) => {
            const isSlow = idx >= 2;
            const status = typeof st === 'string' ? st : st.status || 'available';
            const label = status === 'available' ? 'Available' : status === 'maintenance' || status === 'faulty' ? 'Maintenance' : status === 'occupied' ? 'Occupied' : status === 'soon' || status === 'limited' ? 'Limited' : 'Unavailable';
            return {
                id: `bay-${idx + 1}`,
                bayId: `bay-${idx + 1}`,
                name: `Bay ${idx + 1}`,
                status,
                label,
                type: isSlow ? 'Type 2' : 'CCS2',
                power: isSlow ? '22kW' : '150kW',
                ratePerHour: isSlow ? (station.rates?.slow ? station.rates.slow * 40 : 1680) : (station.rates?.fast ? station.rates.fast * 50 : 2450),
            };
        });
    }

    return [
        { id: 'bay-1', bayId: 'bay-1', name: 'Bay 1', status: 'available', label: 'Available', type: 'CCS2', power: '150kW', ratePerHour: 2450 },
        { id: 'bay-2', bayId: 'bay-2', name: 'Bay 2', status: 'available', label: 'Available', type: 'CCS2', power: '150kW', ratePerHour: 2450 },
        { id: 'bay-3', bayId: 'bay-3', name: 'Bay 3', status: 'available', label: 'Available', type: 'Type 2', power: '22kW', ratePerHour: 1680 },
        { id: 'bay-4', bayId: 'bay-4', name: 'Bay 4', status: 'limited', label: 'Limited', type: 'CHAdeMO', power: '50kW', ratePerHour: 2280 },
    ];
};

const DetailsContent = ({ station, bays, selectedBay, onSelectBay, onBookBay, onDirections, navigate, bayToast, setBayToast }) => (
    <>
        <div className="dt-topbar" style={{ marginBottom: '16px' }}>
            <button className="dt-back-btn" onClick={() => navigate ? navigate(-1) : window.history.back()} title="Back">←</button>
            <div>
                <h1 className="sd-title" style={{ margin: 0 }}>{station.name}</h1>
                <div className="sd-subtitle" style={{ margin: '4px 0 0 0' }}>{station.network}</div>
            </div>
        </div>

        <StatusBar station={station} />

        {/* Floating Toast Notification Popup */}
        {bayToast && (
            <div className="sd-toast-popup" role="alert">
                <div className="sd-toast-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>
                <div className="sd-toast-content">
                    <span className="sd-toast-title">Bay Notice</span>
                    <span className="sd-toast-msg">{bayToast}</span>
                </div>
                <button
                    type="button"
                    className="sd-toast-close"
                    onClick={() => setBayToast('')}
                    aria-label="Close notification"
                >
                    ✕
                </button>
            </div>
        )}

        <div className="sd-address"><IconPin /> {station.address}</div>

        <div className="sd-grid">
            {/* ════════ Left Column: Station Visuals, Specs & Amenities ════════ */}
            <div className="sd-col-details">
                <StationGallery
                    key={station.id}
                    images={station.images && station.images.length ? station.images : [station.image]}
                    alt={station.name}
                    badge={<div className="sd-banner-badge"><IconPlug /></div>}
                />

                <div className="sd-section-title" style={{ marginTop: '20px' }}>Station Overview & Specs</div>
                <div className="sd-info-grid">
                    <div className="sd-info-card">
                        <div className="sd-info-top">
                            <div className="sd-info-label"><IconNav /> Distance</div>
                        </div>
                        <div className="sd-info-value">{station.distanceKm} km</div>
                    </div>
                    <div className="sd-info-card">
                        <div className="sd-info-top">
                            <div className="sd-info-label"><IconClock /> ETA</div>
                        </div>
                        <div className="sd-info-value">{station.distanceMins} min away</div>
                    </div>
                    <div className="sd-info-card">
                        <div className="sd-info-top">
                            <div className="sd-info-label"><IconPlug /> Availability</div>
                        </div>
                        <div className="sd-info-value">{station.pluggedAvailable}/{station.pluggedTotal} Plugs</div>
                    </div>
                    <div className="sd-info-card">
                        <div className="sd-info-top">
                            <div className="sd-info-label"><IconCard /> Price</div>
                        </div>
                        <div className="sd-info-value">{station.priceHeadline}</div>
                    </div>
                    <div className="sd-info-card">
                        <div className="sd-info-top">
                            <div className="sd-info-label"><IconBolt /> Max Speed</div>
                        </div>
                        <div className="sd-info-value">{station.maxChargingSpeedKw} kW</div>
                    </div>
                    <div className="sd-info-card">
                        <div className="sd-info-top">
                            <div className="sd-info-label"><IconPlug /> Total Ports</div>
                        </div>
                        <div className="sd-info-value">{station.portsCount} total</div>
                    </div>
                    <div className="sd-info-card">
                        <div className="sd-info-top">
                            <div className="sd-info-label"><IconClock /> Open Hours</div>
                        </div>
                        <div className="sd-info-value">{station.openHours}</div>
                    </div>
                    <div className="sd-info-card">
                        <div className="sd-info-top">
                            <div className="sd-info-label"><IconStarFilled /> Rating</div>
                        </div>
                        <div className="sd-info-value">{(station.rating || 4.5).toFixed(1)} ★ ({station.reviews || 0})</div>
                    </div>
                    <div className="sd-info-card">
                        <div className="sd-info-top">
                            <div className="sd-info-label"><IconParkingP /> Access Type</div>
                        </div>
                        <div className="sd-info-value">{station.accessType}</div>
                    </div>
                    <div className="sd-info-card full">
                        <div className="sd-info-top">
                            <div className="sd-info-label"><IconCarModel /> Supported Vehicle Models</div>
                        </div>
                        <div className="sd-info-value">{(station.supportedModels || []).join(', ')}</div>
                    </div>
                </div>

                <div className="sd-section-title" style={{ marginTop: '20px' }}>Station Amenities</div>
                <div className="sd-amenities-row">
                    {(station.amenities || []).map((a) => {
                        const Icon = AMENITY_ICONS[a];
                        return (
                            <div key={a} className="sd-amenity-chip">
                                <span className="sd-amenity-icon">{Icon ? <Icon /> : null}</span>
                                {AMENITY_LABELS[a] || a}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ════════ Right Column: Charging Bays & Booking Flow ════════ */}
            <div className="sd-col-actions">
                {/* ── Select Charging Bay Section ── */}
                <div className="sd-bays-section-wrap">
                    <div className="sd-bays-header-row">
                        <div className="sd-section-title" style={{ margin: 0 }}>Select Charging Bay</div>
                        <span className="sd-bays-hint">Managed live by Host/Admin</span>
                    </div>

                    <div className="sd-bays-grid">
                        {bays.map((b) => {
                            const isSelected = selectedBay?.id === b.id || selectedBay?.bayId === b.bayId;
                            const isAvailable = b.status === 'available';
                            return (
                                <div
                                    key={b.id}
                                    className={`sd-bay-card ${b.status} ${isSelected ? 'selected' : ''}`}
                                    onClick={() => onSelectBay(b)}
                                >
                                    <div className="sd-bay-card-top">
                                        <div className="sd-bay-card-title-wrap">
                                            <IconPlug />
                                            <span className="sd-bay-card-name">{b.name}</span>
                                        </div>
                                        <span className={`sd-bay-status-badge ${b.status}`}>
                                            {isAvailable ? '●' : '○'} {b.label}
                                        </span>
                                    </div>

                                    <div className="sd-bay-card-body">
                                        <span className="sd-bay-spec-pill">{b.type} · {b.power}</span>
                                        <span className="sd-bay-rate-val">Rs. {b.ratePerHour.toLocaleString()}/hr</span>
                                    </div>

                                    <div className="sd-bay-action-row">
                                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                            {isAvailable ? 'Click to choose' : 'Currently unavailable'}
                                        </span>
                                        <button
                                            type="button"
                                            className="sd-bay-select-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelectBay(b);
                                                if (isAvailable) onBookBay(b);
                                            }}
                                            disabled={!isAvailable}
                                        >
                                            {isSelected ? 'Selected ✓' : isAvailable ? 'Book This Bay →' : 'Unavailable'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="sd-section-title" style={{ marginTop: '24px' }}>Charging Connectors</div>
                <div className="sd-connectors-grid">
                    {(station.connectors || []).map((c) => (
                        <div key={c.name} className="sd-connector-card">
                            <div className="sd-connector-icon"><IconPlug /></div>
                            <div className="sd-connector-info">
                                <div className="sd-connector-name">{c.name}</div>
                                <div className="sd-connector-kw">{c.kw}</div>
                            </div>
                            <div className={`sd-connector-status ${c.available ? 'yes' : 'no'}`}>
                                {c.available ? '● Available' : '○ Not Available'}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="sd-rates-card" style={{ marginTop: 24 }}>
                    <div className="sd-rates-title">Price Rates</div>
                    <div className="sd-rate-row">
                        <span className="sd-rate-label">Fast Charging</span>
                        <span className="sd-rate-value">LKR {station.rates?.fast || 45} /kWh</span>
                    </div>
                    <div className="sd-rate-row">
                        <span className="sd-rate-label">Slow Charging</span>
                        <span className="sd-rate-value">LKR {station.rates?.slow || 20} /kWh</span>
                    </div>

                    <button
                        className="btn-primary sd-book-btn"
                        onClick={() => onBookBay(selectedBay)}
                    >
                        {selectedBay ? `Book ${selectedBay.name} (${selectedBay.type}) →` : 'Book Your Charger →'}
                    </button>
                    <div className="sd-book-caption">🔒 Secure Booking · Instant Confirmation</div>

                    <button className="btn-ghost" style={{ marginTop: 10 }} onClick={onDirections}>Get Directions</button>
                </div>
            </div>
        </div>
    </>
);

const StationDetails = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [station, setStation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedBay, setSelectedBay] = useState(null);
    const [bayToast, setBayToast] = useState('');

    // Fetch station from backend; fall back to local static data if API is unreachable
    useEffect(() => {
        setLoading(true);
        fetch(`/api/stations/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error('not found');
                return res.json();
            })
            .then((json) => {
                const data = json.data || json;
                const fallback = STATIONS.find((s) => s.id === id || s.id === data.slug) || STATIONS[0];
                const normalized = {
                    ...fallback,
                    ...data,
                    id: data.slug || data.id || id,
                    image: (data.image && data.image.trim()) ? data.image : fallback.image,
                    images: (data.images && data.images.length) ? data.images : fallback.images,
                };
                setStation(normalized);
                const allBays = getNormalizedBays(normalized);
                const bayParam = searchParams.get('bay');
                const matched = allBays.find((b) => b.id === bayParam || b.bayId === bayParam) || allBays.find((b) => b.status === 'available') || allBays[0];
                setSelectedBay(matched);
                setLoading(false);
            })
            .catch(() => {
                const fallback = STATIONS.find((s) => s.id === id) || STATIONS[0];
                setStation(fallback);
                const allBays = getNormalizedBays(fallback);
                const bayParam = searchParams.get('bay');
                const matched = allBays.find((b) => b.id === bayParam || b.bayId === bayParam) || allBays.find((b) => b.status === 'available') || allBays[0];
                setSelectedBay(matched);
                setLoading(false);
            });
    }, [id, searchParams]);

    const bays = useMemo(() => getNormalizedBays(station), [station]);

    const onSelectBay = (bay) => {
        setSelectedBay(bay);
        if (bay.status !== 'available') {
            setBayToast(`${bay.name} is currently ${bay.label.toLowerCase()} (managed by host). Please select an available bay.`);
            setTimeout(() => setBayToast(''), 4000);
        } else {
            setBayToast('');
        }
    };

    const onBookBay = (bayToBook) => {
        const targetBay = bayToBook || selectedBay || bays.find((b) => b.status === 'available') || bays[0];
        if (targetBay.status !== 'available') {
            setBayToast(`${targetBay.name} is ${targetBay.label.toLowerCase()}. Please pick an available bay to book.`);
            setTimeout(() => setBayToast(''), 4000);
            return;
        }
        const stationParam = station?.slug || station?.id || id;
        navigate(`/book-charger?station=${stationParam}&bay=${targetBay.id || targetBay.bayId}`, {
            state: {
                station,
                selectedBay: targetBay,
                bay: targetBay,
            },
        });
    };

    const onDirections = () => {
        const url = getDirectionsUrl(station);
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
    };

    if (loading) {
        return (
            <div className="app-shell station-details-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <Sidebar />
                <main className="app-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Loading station…</div>
                </main>
            </div>
        );
    }

    if (!station) {
        return (
            <div className="app-shell station-details-page">
                <Sidebar />
                <main className="app-main" style={{ padding: '2rem', color: 'var(--text-secondary)' }}>
                    Station not found.
                </main>
            </div>
        );
    }

    const sharedProps = {
        station,
        bays,
        selectedBay,
        onSelectBay,
        onBookBay,
        onDirections,
        navigate,
        bayToast,
        setBayToast,
    };

    return (
        <>
            {/* ---------- Desktop ---------- */}
            <div className="app-shell station-details-page">
                <Sidebar />
                <main className="app-main">
                    <DetailsContent {...sharedProps} />
                </main>
            </div>

            {/* ---------- Mobile ---------- */}
            <div className="mobile-only station-details-page">
                <div className="evora-screen">
                    <div className="nav-bar">
                        <button className="nav-back" onClick={() => navigate(-1)} aria-label="Go back"><IconBack /></button>
                        <span className="nav-title">Station Details</span>
                        <button className="nav-hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
                            <IconMenu />
                        </button>
                    </div>
                    <div style={{ marginTop: 12 }}>
                        <DetailsContent {...sharedProps} />
                    </div>
                </div>
                <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} active="/dashboard" />
            </div>
        </>
    );
};

export default StationDetails;

