// ============================================
// src/pages/BookCharger.jsx
// EVORA - Book Your Charger Page (Dynamic Station Data + Backend API)
// ============================================

import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
    IconBolt,
    IconCalendar,
    IconReceipt,
    IconCCTV,
    IconRestroom,
    IconLounge,
    IconSupport,
    IconShield,
    IconLeaf,
} from '../components/NavigationIcons.jsx';
import { STATIONS } from '../data/stations';
import {
    generateBookingDays,
    ALL_HOURLY_SLOTS,
    computeSlotStatus,
} from '../utils/bookingHelpers';

import kaduwelaHero from '../assets/kaduwela-bay-hero.jpg';
import kaduwelaThumb from '../assets/kaduwela-bay-thumb.jpg';

/* ---------- Fallback Mock Data ---------- */
const DEFAULT_STATION = {
    name: 'Kaduwela Bay Charging Hub',
    address: 'Kaduwela Bay 01, Colombo',
    rating: '4.8',
    reviewsCount: '120+ reviews',
    tag: 'Ultra-Fast',
    power: 'Up to 150kW',
    model: 'Model 3',
    image: kaduwelaHero,
    thumb: kaduwelaThumb,
    amenities: [
        { icon: IconCCTV, title: 'CCTV', sub: 'Secured' },
        { icon: IconRestroom, title: 'Restroom', sub: 'Available' },
        { icon: IconLounge, title: 'Waiting Area', sub: 'Comfortable' },
        { icon: IconSupport, title: '24/7', sub: 'Support' },
    ],
};

const DEFAULT_CONNECTORS = [
    {
        id: 'ccs2',
        label: 'CCS Combo 2',
        shortLabel: 'CCS2',
        specs: 'Power · 50kW – 150kW',
        ratePerHour: 2450,
    },
    {
        id: 'type2',
        label: 'Type 2 AC',
        shortLabel: 'Type 2 AC',
        specs: 'Power · 3.7kW – 22kW',
        ratePerHour: 1680,
    },
    {
        id: 'chademo',
        label: 'CHAdeMO (DC)',
        shortLabel: 'CHAdeMO',
        specs: 'Power · 50kW',
        ratePerHour: 2280,
    },
    {
        id: 'nacs',
        label: 'Tesla NACS',
        shortLabel: 'Tesla NACS',
        specs: 'Power · 50kW',
        ratePerHour: 2450,
    },
];

const matchConnectorForBay = (bay, connectorsList) => {
    if (!bay || !connectorsList || !connectorsList.length) return 0;
    const bType = (bay.type || '').toLowerCase();

    // 1. Direct type match: Type 2 AC
    if (bType.includes('type 2') || bType.includes('type2') || bType.includes('ac')) {
        const found = connectorsList.findIndex((c) => {
            const name = (c.label || c.name || c.shortLabel || '').toLowerCase();
            return name.includes('type 2') || name.includes('type2') || name.includes('ac');
        });
        if (found !== -1) return found;
    }

    // 2. Direct type match: CCS / CCS2 / CCS Combo 2
    if (bType.includes('ccs') || bType.includes('combo')) {
        const found = connectorsList.findIndex((c) => {
            const name = (c.label || c.name || c.shortLabel || '').toLowerCase();
            return name.includes('ccs') || name.includes('combo');
        });
        if (found !== -1) return found;
    }

    // 3. Direct type match: CHAdeMO
    if (bType.includes('chademo')) {
        const found = connectorsList.findIndex((c) => {
            const name = (c.label || c.name || c.shortLabel || '').toLowerCase();
            return name.includes('chademo');
        });
        if (found !== -1) return found;
    }

    // 4. Direct type match: Tesla / NACS
    if (bType.includes('tesla') || bType.includes('nacs')) {
        const found = connectorsList.findIndex((c) => {
            const name = (c.label || c.name || c.shortLabel || '').toLowerCase();
            return name.includes('tesla') || name.includes('nacs');
        });
        if (found !== -1) return found;
    }

    // 5. Fallback substring match
    const fallbackIdx = connectorsList.findIndex((c) => {
        const name = (c.label || c.name || c.shortLabel || '').toLowerCase();
        return name.includes(bType) || bType.includes(name);
    });

    return fallbackIdx !== -1 ? fallbackIdx : 0;
};

const DURATION_PRESETS = [30, 60, 90, 120];
const MIN_DURATION = 15;
const MAX_DURATION = 180;
const DURATION_STEP = 15;

/* ---------- Dropdown for Connector Selection ---------- */
const ConnectorDropdownMenu = ({ connectors, connector, connectorIdx, setConnectorIdx, dropdownOpen, setDropdownOpen }) => {
    const list = connectors && connectors.length ? connectors : DEFAULT_CONNECTORS;
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
                    {list.map((c, i) => {
                        const isSelected = connectorIdx === i;
                        return (
                            <div
                                key={c.id || i}
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
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const stationParam = searchParams.get('station');
    const bayParam = searchParams.get('bay');

    // Dynamic Station state from passed state or URL param
    const [stationData, setStationData] = useState(location.state?.station || null);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Real date & time state
    const [weekOffset, setWeekOffset] = useState(0);
    const [selectedDateIdx, setSelectedDateIdx] = useState(0);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [loadingAvailability, setLoadingAvailability] = useState(false);

    const [duration, setDuration] = useState(60);
    const [connectorIdx, setConnectorIdx] = useState(0);
    const [selectedBayId, setSelectedBayId] = useState(
        location.state?.selectedBay?.id ||
        location.state?.bay?.id ||
        location.state?.selectedBay?.bayId ||
        location.state?.bay?.bayId ||
        bayParam ||
        'bay-1'
    );
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Dynamic real dates list generated starting from today
    const dates = useMemo(() => generateBookingDays(weekOffset, 7), [weekOffset]);
    const activeDateObj = dates[selectedDateIdx] || dates[0] || generateBookingDays(0, 1)[0];

    // Fetch station info if stationParam provided and stationData not yet populated
    useEffect(() => {
        if (!stationData && stationParam) {
            const fetchStation = async () => {
                try {
                    let res = await fetch(`http://localhost:5000/api/stations/${stationParam}`);
                    if (!res.ok) res = await fetch(`/api/stations/${stationParam}`);
                    if (res.ok) {
                        const json = await res.json();
                        const data = json.data || json;
                        setStationData(data);
                        return;
                    }
                } catch {
                    // ignore network errors and use local fallback
                }
                const local = STATIONS.find((s) => s.id === stationParam || s.slug === stationParam);
                if (local) setStationData(local);
            };
            fetchStation();
        }
    }, [stationParam, stationData]);

    // Construct tailored Station View and Bays
    const displayStation = useMemo(() => {
        if (!stationData) return DEFAULT_STATION;

        const fastRate = stationData.rates?.fast ? stationData.rates.fast * 50 : 2450;
        const slowRate = stationData.rates?.slow ? stationData.rates.slow * 40 : 1680;

        const dynamicConnectors = (stationData.connectors && stationData.connectors.length > 0)
            ? stationData.connectors.map((c, idx) => ({
                id: `conn-${idx}`,
                label: c.name || 'Connector',
                shortLabel: c.name || 'Connector',
                specs: c.kw ? `Power · ${c.kw}` : 'Standard Fast Charge',
                ratePerHour: c.name?.toLowerCase().includes('slow') || c.name?.toLowerCase().includes('type 2') ? slowRate : fastRate,
            }))
            : DEFAULT_CONNECTORS;

        const rawBays = stationData.baysDetail && stationData.baysDetail.length > 0
            ? stationData.baysDetail
            : (stationData.bays || ['available', 'available', 'available', 'available']).map((st, idx) => {
                const isSlow = idx >= 2;
                const status = typeof st === 'string' ? st : st.status || 'available';
                const label = status === 'available' ? 'Available' : status === 'maintenance' ? 'Maintenance' : status === 'occupied' ? 'Occupied' : 'Unavailable';
                return {
                    id: `bay-${idx + 1}`,
                    bayId: `bay-${idx + 1}`,
                    name: `Bay ${idx + 1}`,
                    status,
                    label,
                    type: isSlow ? 'Type 2' : 'CCS2',
                    power: isSlow ? '22kW' : '150kW',
                    ratePerHour: isSlow ? slowRate : fastRate,
                };
            });

        const normalizedBays = rawBays.map((b, idx) => ({
            id: b.bayId || b.id || `bay-${idx + 1}`,
            bayId: b.bayId || b.id || `bay-${idx + 1}`,
            name: b.name || `Bay ${idx + 1}`,
            status: b.status || 'available',
            label: b.label || (b.status === 'available' ? 'Available' : 'Unavailable'),
            type: b.type || (idx >= 2 ? 'Type 2' : 'CCS2'),
            power: b.power || (idx >= 2 ? '22kW' : '150kW'),
            ratePerHour: b.ratePerHour || (b.type?.toLowerCase().includes('type 2') ? slowRate : fastRate),
        }));

        return {
            name: stationData.name || DEFAULT_STATION.name,
            address: stationData.address || DEFAULT_STATION.address,
            rating: stationData.rating ? String(stationData.rating) : '4.8',
            reviewsCount: stationData.reviews ? `${stationData.reviews} reviews` : '120+ reviews',
            tag: stationData.tags?.[0] || (stationData.maxChargingSpeedKw >= 100 ? 'Ultra-Fast' : 'Standard Fast'),
            power: stationData.maxChargingSpeedKw ? `Up to ${stationData.maxChargingSpeedKw}kW` : 'Up to 150kW',
            model: stationData.supportedModels?.[0] || 'Model 3',
            image: (stationData.images && stationData.images[0]) || stationData.image || kaduwelaHero,
            thumb: stationData.image || kaduwelaThumb,
            connectors: dynamicConnectors,
            bays: normalizedBays,
            amenities: DEFAULT_STATION.amenities,
            raw: stationData,
        };
    }, [stationData]);

    const activeBays = displayStation.bays || [
        { id: 'bay-1', bayId: 'bay-1', name: 'Bay 1', status: 'available', label: 'Available', type: 'CCS2', power: '150kW', ratePerHour: 2450 },
        { id: 'bay-2', bayId: 'bay-2', name: 'Bay 2', status: 'available', label: 'Available', type: 'CCS2', power: '150kW', ratePerHour: 2450 },
        { id: 'bay-3', bayId: 'bay-3', name: 'Bay 3', status: 'available', label: 'Available', type: 'Type 2', power: '22kW', ratePerHour: 1680 },
        { id: 'bay-4', bayId: 'bay-4', name: 'Bay 4', status: 'limited', label: 'Limited', type: 'CHAdeMO', power: '50kW', ratePerHour: 2280 },
    ];

    const currentBay = activeBays.find((b) => b.id === selectedBayId || b.bayId === selectedBayId) || activeBays[0];

    const activeConnectors = displayStation.connectors || DEFAULT_CONNECTORS;
    const safeConnectorIdx = Math.min(connectorIdx, activeConnectors.length - 1);
    const connector = activeConnectors[safeConnectorIdx] || DEFAULT_CONNECTORS[0];

    // Fetch existing pre-booked slots from MongoDB database for the active station, bay & date
    useEffect(() => {
        const fetchAvailability = async () => {
            if (!activeDateObj?.isoDate) return;
            const slug = displayStation.raw?.slug || stationParam || '';
            const bay = selectedBayId || 'bay-1';
            setLoadingAvailability(true);
            try {
                let url = `http://localhost:5000/api/bookings/availability?stationSlug=${encodeURIComponent(slug)}&bayId=${encodeURIComponent(bay)}&date=${activeDateObj.isoDate}`;
                let res = await fetch(url);
                if (!res.ok) {
                    res = await fetch(`/api/bookings/availability?stationSlug=${encodeURIComponent(slug)}&bayId=${encodeURIComponent(bay)}&date=${activeDateObj.isoDate}`);
                }
                if (res.ok) {
                    const json = await res.json();
                    const data = json.data || json;
                    setBookedSlots(data.bookedSlots || []);
                } else {
                    setBookedSlots([]);
                }
            } catch (err) {
                console.warn('Availability fetch fallback:', err);
                setBookedSlots([]);
            } finally {
                setLoadingAvailability(false);
            }
        };
        fetchAvailability();
    }, [activeDateObj?.isoDate, displayStation.raw?.slug, stationParam, selectedBayId]);

    // Compute live 24-hour slots with past time and pre-booked validation
    const computedTimeSlots = useMemo(() => {
        return ALL_HOURLY_SLOTS.map((slot) => {
            const info = computeSlotStatus({
                slotHour: slot.hour,
                slotTime: slot.time,
                selectedDate: activeDateObj.date,
                bookedSlots,
                bayStatus: currentBay?.status || 'available',
            });
            return {
                ...slot,
                ...info,
            };
        });
    }, [activeDateObj.date, bookedSlots, currentBay?.status]);

    // Auto-select first available valid slot if current selection is invalid/disabled
    useEffect(() => {
        if (!computedTimeSlots || computedTimeSlots.length === 0) return;

        const currentSelected = computedTimeSlots.find(
            (s) => s.time === selectedTimeSlot && !s.disabled
        );

        if (!currentSelected) {
            const firstAvailable = computedTimeSlots.find((s) => !s.disabled);
            if (firstAvailable) {
                setSelectedTimeSlot(firstAvailable.time);
            } else {
                setSelectedTimeSlot(null);
            }
        }
    }, [computedTimeSlots, selectedTimeSlot]);

    // When changing bay, update connector and hourly rate automatically
    const handleSelectBay = (bay) => {
        setSelectedBayId(bay.id || bay.bayId);
        const matchIdx = matchConnectorForBay(bay, activeConnectors);
        setConnectorIdx(matchIdx);
    };

    // Auto-sync connector dropdown when bay or station loads
    useEffect(() => {
        if (currentBay && activeConnectors && activeConnectors.length > 0) {
            const matchIdx = matchConnectorForBay(currentBay, activeConnectors);
            setConnectorIdx(matchIdx);
        }
    }, [selectedBayId, displayStation]);

    const estCost = useMemo(() => {
        const hours = duration / 60;
        const rate = currentBay?.ratePerHour || connector?.ratePerHour || 2450;
        return Math.round(hours * rate);
    }, [duration, currentBay, connector]);

    const changeDuration = (delta) => {
        setDuration((d) => Math.min(MAX_DURATION, Math.max(MIN_DURATION, d + delta)));
    };

    const handleSelectTime = (slotTime) => {
        setSelectedTimeSlot(slotTime);
    };

    // Confirm booking: Submit to backend POST /api/bookings and save to MongoDB
    const handleConfirm = async () => {
        if (!selectedTimeSlot) {
            setErrorMsg('Please select an available charging time slot before continuing.');
            return;
        }

        const chosenSlotObj = computedTimeSlots.find((s) => s.time === selectedTimeSlot);
        if (!chosenSlotObj || chosenSlotObj.disabled) {
            setErrorMsg(`The slot '${selectedTimeSlot}' is ${chosenSlotObj?.status === 'past' ? 'in the past' : chosenSlotObj?.status === 'booked' ? 'already booked' : 'unavailable'}. Please choose an available time slot.`);
            return;
        }

        setSubmitting(true);
        setErrorMsg('');

        let driverId = undefined;
        let token = localStorage.getItem('evora_token');
        try {
            const userObj = JSON.parse(
                localStorage.getItem('evora_current_user') ||
                localStorage.getItem('evora_driver_user') ||
                '{}'
            );
            if (userObj._id || userObj.id) {
                driverId = userObj._id || userObj.id;
            }
        } catch {
            // ignore
        }

        const payload = {
            stationId: displayStation.raw?._id || undefined,
            stationSlug: displayStation.raw?.slug || stationParam || '',
            stationName: displayStation.name,
            stationAddress: displayStation.address,
            bayId: currentBay?.id || currentBay?.bayId || 'bay-1',
            bayName: currentBay?.name || 'Bay 1',
            connectorType: `${currentBay?.name ? currentBay.name + ' · ' : ''}${connector.label}`,
            slot: selectedTimeSlot,
            date: activeDateObj.isoDate,
            durationMinutes: duration,
            estimatedTotalcost: estCost.toLocaleString(),
            driverId,
        };

        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        try {
            let res = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers,
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                res = await fetch('/api/bookings', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(payload),
                });
            }

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || 'Booking conflict or server error. Please select another slot.');
            }

            const json = await res.json();
            const createdBooking = json.data || json;

            // Navigate to Booking Confirmed popup with real stored data
            navigate('/booking-confirmed', {
                state: {
                    booking: {
                        id: createdBooking.bookingNumber || createdBooking._id || '212456',
                        bookingNumber: createdBooking.bookingNumber,
                        station: displayStation.name,
                        stationName: displayStation.name,
                        stationLabel: 'Station Location',
                        bayName: currentBay?.name || 'Bay 1',
                        dateTime: `${activeDateObj.num}th ${activeDateObj.month} ${selectedTimeSlot}`,
                        dateTimeLabel: 'Date & Time',
                        duration: `${duration} min`,
                        durationMinutes: duration,
                        durationLabel: 'Estimated Duration',
                        cost: `Rs. ${estCost.toLocaleString()}`,
                        ...createdBooking,
                    },
                },
            });
        } catch (err) {
            console.error('Error saving booking:', err);
            setErrorMsg(err.message || 'Failed to complete booking. Please try another slot.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="app-shell book-charger-shell">
            {/* Desktop Sidebar */}
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
                                Find and reserve your charging slot at {displayStation.name}.
                            </p>
                        </div>
                    </div>

                    {/* Mobile Hamburger */}
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

                {errorMsg && (
                    <div style={{ background: '#ff4d6d22', color: '#ff4d6d', padding: '10px 16px', borderRadius: '8px', marginBottom: '16px' }}>
                        {errorMsg}
                    </div>
                )}

                {/* ── Main Two-Column Layout ── */}
                <div className="bc-content-grid">
                    {/* ════════ Left Column ════════ */}
                    <section className="bc-left-col">
                        {/* 1. Station Hero Banner Card */}
                        <div className="bc-hero-card">
                            <div className="bc-hero-media">
                                <img
                                    src={displayStation.image}
                                    alt={displayStation.name}
                                    className="bc-hero-img"
                                />
                                <div className="bc-hero-overlay" />
                            </div>

                            {/* Top Badges */}
                            <div className="bc-hero-top-badges">
                                <div className="bc-rating-badge">
                                    <span className="bc-star">★</span>
                                    <span className="bc-rating-val">{displayStation.rating}</span>
                                    <span className="bc-reviews-count">({displayStation.reviewsCount})</span>
                                </div>

                                <div className="bc-speed-badge">
                                    <span className="bc-speed-icon">
                                        <IconBolt filled />
                                    </span>
                                    <div className="bc-speed-text">
                                        <span className="bc-speed-tag">{displayStation.tag}</span>
                                        <span className="bc-speed-sub">{displayStation.power}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Station Details & Amenities */}
                            <div className="bc-hero-bottom-info">
                                <div className="bc-hero-title-group">
                                    <h2 className="bc-hero-title">{displayStation.name}</h2>
                                    <p className="bc-hero-location">
                                        <span className="bc-pin-icon">📍</span>
                                        {displayStation.address}
                                    </p>
                                </div>

                                <div className="bc-amenities-row">
                                    {displayStation.amenities.map((item, idx) => {
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

                        {/* 2. Select Charging Bay Card */}
                        <div className="bc-section-card">
                            <div className="bc-card-header">
                                <div className="bc-card-header-left">
                                    <span className="bc-card-icon">
                                        <IconBolt />
                                    </span>
                                    <div>
                                        <h3 className="bc-card-title">Select Charging Bay</h3>
                                        <p className="bc-card-desc">Live hardware availability managed by Host/Admin</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bc-bays-grid">
                                {activeBays.map((bay) => {
                                    const isSelected = (currentBay?.id === bay.id) || (currentBay?.bayId === bay.id);
                                    const isAvailable = bay.status === 'available';
                                    return (
                                        <button
                                            key={bay.id}
                                            type="button"
                                            className={`bc-bay-chip ${isSelected ? 'active' : ''}`}
                                            onClick={() => handleSelectBay(bay)}
                                            disabled={!isAvailable}
                                            title={!isAvailable ? `${bay.name} is currently ${bay.label}` : `Select ${bay.name}`}
                                        >
                                            <div className="bc-bay-chip-title">
                                                <span>{bay.name}</span>
                                                {isSelected && <span style={{ color: '#00e599' }}>✓</span>}
                                            </div>
                                            <div className="bc-bay-chip-sub">
                                                {bay.type} · {bay.power}
                                            </div>
                                            <div className={`bc-bay-chip-status ${bay.status}`}>
                                                {isAvailable ? '● Available' : `○ ${bay.label}`}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 3. Select Date Card */}
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
                                            onClick={() => setWeekOffset((prev) => Math.max(0, prev - 7))}
                                            disabled={weekOffset === 0}
                                            title={weekOffset === 0 ? 'Cannot select past dates' : 'Previous Week'}
                                        >
                                            ‹
                                        </button>
                                        <button
                                            type="button"
                                            className="bc-arrow-btn"
                                            onClick={() => setWeekOffset((prev) => prev + 7)}
                                            title="Next Week"
                                        >
                                            ›
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bc-date-chips-grid">
                                {dates.map((d, i) => {
                                    const isSelected = selectedDateIdx === i;
                                    return (
                                        <button
                                            key={d.isoDate}
                                            type="button"
                                            className={`bc-date-chip ${isSelected ? 'active' : ''} ${d.isToday ? 'is-today' : ''}`}
                                            onClick={() => setSelectedDateIdx(i)}
                                            title={d.isToday ? 'Today' : `${d.day}, ${d.num} ${d.month}`}
                                        >
                                            <span className="bc-chip-day">
                                                {d.day}
                                                {d.isToday && <span className="bc-chip-today-dot" title="Today">•</span>}
                                            </span>
                                            <span className="bc-chip-num">{d.num}</span>
                                            <span className="bc-chip-month">{d.shortMonth}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 4. Select Time Slot Card */}
                        <div className="bc-section-card">
                            <div className="bc-card-header">
                                <div className="bc-card-header-left">
                                    <span className="bc-card-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                    </span>
                                    <div>
                                        <h3 className="bc-card-title">Select Time Slot</h3>
                                        {loadingAvailability && (
                                            <span style={{ fontSize: '11px', color: '#00e599', marginLeft: '6px' }}>Checking live availability...</span>
                                        )}
                                    </div>
                                </div>
                                <div className="bc-time-legend">
                                    <span className="bc-legend-item">
                                        <span className="bc-legend-dot available" />
                                        Available
                                    </span>
                                    <span className="bc-legend-item">
                                        <span className="bc-legend-dot booked" />
                                        Pre-booked
                                    </span>
                                    <span className="bc-legend-item">
                                        <span className="bc-legend-dot past" />
                                        Past / Closed
                                    </span>
                                </div>
                            </div>

                            <div className="bc-time-slots-row">
                                {computedTimeSlots.map((slot) => {
                                    const isSelected = selectedTimeSlot === slot.time && !slot.disabled;
                                    return (
                                        <button
                                            key={slot.time}
                                            type="button"
                                            className={`bc-time-btn ${slot.status} ${isSelected ? 'selected' : ''}`}
                                            onClick={() => !slot.disabled && handleSelectTime(slot.time)}
                                            disabled={slot.disabled}
                                            title={
                                                slot.status === 'past'
                                                    ? `${slot.time} - Time slot has already passed`
                                                    : slot.status === 'booked'
                                                    ? `${slot.time} - Pre-booked by another driver`
                                                    : slot.status === 'unavailable'
                                                    ? `${slot.time} - Bay is currently unavailable`
                                                    : `Select ${slot.time}`
                                            }
                                        >
                                            <span className="bc-time-btn-label">{slot.time}</span>
                                            {slot.status === 'booked' && <span className="bc-time-tag booked">Booked</span>}
                                            {slot.status === 'past' && <span className="bc-time-tag past">Past</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 5. Charging Duration Card */}
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
                                        src={displayStation.thumb}
                                        alt={displayStation.name}
                                        className="bc-summary-thumb-img"
                                    />
                                </div>
                                <div className="bc-summary-station-text">
                                    <h4 className="bc-summary-station-name">{displayStation.name}</h4>
                                    <p className="bc-summary-station-loc">{displayStation.address}</p>
                                </div>
                                <span className="bc-summary-model-pill">{displayStation.model}</span>
                            </div>

                            {/* Detail List */}
                            <div className="bc-summary-specs-list">
                                <div className="bc-summary-spec-row">
                                    <span className="bc-spec-label">
                                        <span className="bc-spec-icon"><IconBolt /></span> Charging Bay
                                    </span>
                                    <span className="bc-spec-value bc-highlight">
                                        {currentBay?.name || 'Bay 1'} ({currentBay?.type || 'CCS2'})
                                    </span>
                                </div>

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
                                        {selectedTimeSlot || 'No slot available'}
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
                                        {currentBay?.power ? `Power · ${currentBay.power}` : connector.specs}
                                    </span>
                                </div>
                            </div>

                            {/* Connector Interactive Dropdown Selector */}
                            <div className="bc-connector-selector-box">
                                <ConnectorDropdownMenu
                                    connectors={activeConnectors}
                                    connector={connector}
                                    connectorIdx={safeConnectorIdx}
                                    setConnectorIdx={setConnectorIdx}
                                    dropdownOpen={dropdownOpen}
                                    setDropdownOpen={setDropdownOpen}
                                />
                            </div>

                            {/* Estimated Total Box */}
                            <div className="bc-total-card">
                                <div className="bc-total-left">
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
                                disabled={submitting}
                                style={{ opacity: submitting ? 0.7 : 1, cursor: submitting ? 'wait' : 'pointer' }}
                            >
                                <span>{submitting ? 'Confirming Booking...' : 'Confirm Booking'}</span>
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
