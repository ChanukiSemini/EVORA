// ============================================
// src/pages/FindStation.jsx
// "Find Your Station" — Home / dashboard page.
// Desktop: <Sidebar/> + <main>. Mobile: hamburger
// + <MobileNav/> drawer. Same content is reused
// for both so nothing has to be kept in sync.
// ============================================

import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';
import { STATIONS } from '../data/stations';
import {
    IconSearch, IconHeart, IconBell, IconMenu, IconChevronDown, IconCheck,
    IconStarFilled, IconPin, IconPlug, IconCarSmall, IconLocate, IconPlus,
    IconMinus, IconRoute, IconClock, IconFilter, IconChevronRight,
} from '../components/Icons';

const SORT_OPTIONS = ['Nearby', 'Ratings', 'Charging Speed', 'Vehicle Model', 'Charging Port'];
const VEHICLE_MODELS = [...new Set(STATIONS.flatMap((station) => station.supportedModels || []))];
const CHARGING_PORTS = ['CCS2', 'Type 2', 'Tesla NACS', 'CHAdeMO'];

const stationHasPort = (station, port) =>
    (station.connectors || []).some((connector) => {
        const name = connector.name.toLowerCase();
        if (port === 'CCS2') return name.includes('ccs');
        if (port === 'Type 2') return name.includes('type 2');
        if (port === 'Tesla NACS') return name.includes('nacs');
        if (port === 'CHAdeMO') return name.includes('chademo');
        return false;
    });

// Fixed layout positions (percent of map card) so the pins line up
// with the little illustrated "roads" behind them.
const MAP_POSITIONS = {
    'one-galle-face': { x: 44, y: 78 },
    'colombo-city-center': { x: 30, y: 22 },
    'independence-arcade': { x: 33, y: 48 },
    'havelock-city': { x: 63, y: 55 },
    'morven-hotel': { x: 52, y: 34 },
    'vedrive-station': { x: 78, y: 30 },
    'volt-charge-cod': { x: 22, y: 62 },
};

const getPos = (id) => MAP_POSITIONS[id] || { x: 50, y: 50 };

const directionsUrl = (station) =>
    `https://www.google.com/maps/dir/?api=1&destination=${station?.lat || 6.9270},${station?.lng || 79.8612}`;

// Mock notifications feed — swap for a real API later.
const NOTIFICATIONS = [
    { id: 1, title: 'Havelock City Mall', text: '5 of 6 plugs are available right now.' },
    { id: 2, title: 'One Galle Face Mall', text: 'Your favourite station is fully open today.' },
    { id: 3, title: 'New station added', text: 'Morven Hotel Colombo just joined the network.' },
    { id: 4, title: 'Colombo City Center Mall', text: 'Opening soon — 2 bays already reserved.' },
];

const sortComparator = (sortBy) => {
    switch (sortBy) {
        case 'Ratings':
            return (a, b) => (b.rating || 0) - (a.rating || 0);
        case 'Charging Speed':
            return (a, b) => (b.maxChargingSpeedKw || 0) - (a.maxChargingSpeedKw || 0);
        case 'Vehicle Model':
            return (a, b) => (b.supportedModels?.length || 0) - (a.supportedModels?.length || 0);
        case 'Charging Port':
            return (a, b) => (b.portsCount || 0) - (a.portsCount || 0);
        case 'Nearby':
        default:
            return (a, b) => (a.distanceMins || 0) - (b.distanceMins || 0);
    }
};

const FindStationContent = ({
    selected, setSelectedId, search, setSearch, sortOpen, setSortOpen,
    sortBy, setSortBy, favorites, toggleFavorite, goDetails,
    favOpen, setFavOpen, notifOpen, setNotifOpen, zoom, setZoom,
    routeOn, setRouteOn, locating, onLocate, activeTab, setActiveTab,
    selectedModel, setSelectedModel, selectedPort, setSelectedPort,
}) => {
    const favBtnRef = useRef(null);
    const notifBtnRef = useRef(null);
    const [selectedBay, setSelectedBay] = useState(null);

    const safeSelected = selected || STATIONS[0];

    const baysData = useMemo(() => {
        if (!safeSelected) return [];
        if (Array.isArray(safeSelected.baysDetail)) return safeSelected.baysDetail;
        if (Array.isArray(safeSelected.bays)) {
            return safeSelected.bays.map((item, idx) => {
                if (typeof item === 'object' && item !== null) return item;
                const status = item === 'available' ? 'available' : item === 'soon' || item === 'limited' ? 'limited' : 'unavailable';
                const label = status === 'available' ? 'Available' : status === 'limited' ? 'Limited' : 'Unavailable';
                return { name: `Bay ${idx + 1}`, status, label };
            });
        }
        return [
            { name: 'Bay 1', status: 'available', label: 'Available' },
            { name: 'Bay 2', status: 'available', label: 'Available' },
            { name: 'Bay 3', status: 'limited', label: 'Limited' },
            { name: 'Bay 4', status: 'unavailable', label: 'Unavailable' },
        ];
    }, [safeSelected]);

    const displayedStations = useMemo(() => {
        let list = STATIONS;
        if (activeTab === 'favorites') {
            list = STATIONS.filter((s) => favorites[s.id]);
        } else if (activeTab === 'recent') {
            const recentIds = ['colombo-city-center', 'morven-hotel', 'one-galle-face'];
            list = STATIONS.filter((s) => recentIds.includes(s.id));
        }
        const term = search.trim().toLowerCase();
        return list
            .filter((s) => !selectedModel || s.supportedModels?.includes(selectedModel))
            .filter((s) => !selectedPort || stationHasPort(s, selectedPort))
            .filter((s) => !term || s.name.toLowerCase().includes(term) || s.address.toLowerCase().includes(term))
            .sort(sortComparator(sortBy));
    }, [search, activeTab, favorites, sortBy, selectedModel, selectedPort]);

    const favoriteStations = useMemo(
        () => STATIONS.filter((s) => favorites[s.id]),
        [favorites],
    );

    const selectedPos = getPos(safeSelected.id);
    const highestSpeed = Math.max(...displayedStations.map((station) => station.maxChargingSpeedKw || 0));
    const showMapMetric = sortBy === 'Ratings' || sortBy === 'Charging Speed';
    const activeFilterCount = Number(Boolean(selectedModel)) + Number(Boolean(selectedPort));

    return (
        <>
            <div className="fs-topbar">
                <div className="fs-search-wrap">
                    <IconSearch />
                    <input
                        placeholder="Search location or station name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="fs-topbar-actions">
                    <div className="fs-popout-anchor">
                        <button
                            ref={favBtnRef}
                            className={`fs-icon-btn ${favOpen ? 'active' : ''}`}
                            aria-label="Favorites"
                            onClick={() => { setFavOpen((o) => !o); setNotifOpen(false); }}
                        >
                            <IconHeart filled={favoriteStations.length > 0} />
                            <span className="fs-icon-badge">{favoriteStations.length}</span>
                        </button>
                        {favOpen && (
                            <div className="fs-popout">
                                <div className="fs-popout-header">Favourite Stations</div>
                                <div className="fs-popout-list">
                                    {favoriteStations.length === 0 && (
                                        <div className="fs-popout-empty">No favourites yet — tap the ♡ on any station to save it here.</div>
                                    )}
                                    {favoriteStations.map((s) => (
                                        <div
                                            key={s.id}
                                            className="fs-popout-item"
                                            onClick={() => { setSelectedId(s.id); setFavOpen(false); }}
                                        >
                                            <img src={s.image} alt={s.name} />
                                            <div>
                                                <div className="fs-popout-item-name">{s.name}</div>
                                                <div className="fs-popout-item-sub">{s.distanceMins} mins away · {s.rating.toFixed(1)} ★</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="fs-popout-anchor">
                        <button
                            ref={notifBtnRef}
                            className={`fs-icon-btn ${notifOpen ? 'active' : ''}`}
                            aria-label="Notifications"
                            onClick={() => { setNotifOpen((o) => !o); setFavOpen(false); }}
                        >
                            <IconBell />
                            <span className="fs-icon-badge">{NOTIFICATIONS.length}</span>
                        </button>
                        {notifOpen && (
                            <div className="fs-popout">
                                <div className="fs-popout-header">Notifications</div>
                                <div className="fs-popout-list">
                                    {NOTIFICATIONS.map((n) => (
                                        <div key={n.id} className="fs-popout-item" style={{ cursor: 'default' }}>
                                            <span className="fs-popout-notif-icon"><IconBell /></span>
                                            <div>
                                                <div className="fs-popout-item-name">{n.title}</div>
                                                <div className="fs-popout-item-sub">{n.text}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <h1 className="fs-heading">Find Your Station</h1>

            <div className="fs-grid">
                <div className="fs-left">
                    <div className="fs-map-card">
                        <div
                            className="fs-map-zoom-wrap"
                            style={{ transform: `scale(${zoom})` }}
                        >
                            <svg className="fs-map-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M0 30 Q 35 10 55 25 T 100 20" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" fill="none" />
                                <path d="M10 0 Q 20 40 15 60 T 30 100" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" fill="none" />
                                <path d="M60 0 Q 55 45 68 60 T 60 100" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" fill="none" />
                                {routeOn && (
                                    <path
                                        d={`M18 8 L ${selectedPos.x} ${selectedPos.y}`}
                                        stroke="var(--accent-cyan)" strokeWidth="0.6" strokeDasharray="2 2" fill="none"
                                    />
                                )}
                            </svg>

                            <div
                                className="fs-map-you"
                                style={{
                                    left: '18%', top: '8%',
                                    boxShadow: locating ? '0 0 0 16px rgba(9,209,199,0.02)' : undefined,
                                }}
                                title="You are here"
                            />

                            {STATIONS.map((s) => {
                                const pos = getPos(s.id);
                                const isHighestSpeed = sortBy === 'Charging Speed' && (s.maxChargingSpeedKw || 0) === highestSpeed;
                                return (
                                    <div
                                        key={s.id}
                                        className={`fs-map-pin ${s.status} ${s.id === safeSelected.id ? 'selected' : ''} ${isHighestSpeed ? 'highlighted' : ''}`}
                                        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                                        onClick={() => setSelectedId(s.id)}
                                        title={s.name}
                                    >
                                        {showMapMetric && (
                                            <div className="fs-map-pin-rating">
                                                {sortBy === 'Ratings' ? <><IconStarFilled /> {(s.rating || 4).toFixed(1)}</> : `${s.maxChargingSpeedKw || 0} kW`}
                                            </div>
                                        )}
                                        <div className="fs-map-pin-dot"><IconPlug /></div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="fs-map-controls">
                            <button className="fs-map-ctrl-btn" aria-label="Locate me" onClick={onLocate}><IconLocate /></button>
                            <button
                                className="fs-map-ctrl-btn"
                                aria-label="Zoom in"
                                onClick={() => setZoom((z) => Math.min(1.8, +(z + 0.2).toFixed(2)))}
                            >
                                <IconPlus />
                            </button>
                            <button
                                className="fs-map-ctrl-btn"
                                aria-label="Zoom out"
                                onClick={() => setZoom((z) => Math.max(0.8, +(z - 0.2).toFixed(2)))}
                            >
                                <IconMinus />
                            </button>
                            <button
                                className={`fs-map-ctrl-btn ${routeOn ? 'active' : ''}`}
                                aria-label="Toggle route"
                                onClick={() => setRouteOn((r) => !r)}
                            >
                                <IconRoute />
                            </button>
                        </div>

                        <div className="fs-map-legend">
                            <div className="fs-map-legend-title">Station Status</div>
                            <div className="fs-map-legend-item"><span className="fs-map-legend-dot available" /> Available</div>
                            <div className="fs-map-legend-item"><span className="fs-map-legend-dot soon" /> Soon Available</div>
                            <div className="fs-map-legend-item"><span className="fs-map-legend-dot full" /> Full / Closed</div>
                            <div className="fs-map-legend-item"><span className="fs-map-legend-line" /> Route path</div>
                        </div>
                    </div>

                    <div className="fs-list-header">
                        <div className="fs-list-tabs">
                            <button
                                className={`fs-tab-btn ${activeTab === 'nearby' ? 'active' : ''}`}
                                onClick={() => setActiveTab('nearby')}
                            >
                                Nearby Stations
                            </button>
                            <button
                                className={`fs-tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
                                onClick={() => setActiveTab('favorites')}
                            >
                                <IconHeart /> Favorites
                            </button>
                            <button
                                className={`fs-tab-btn ${activeTab === 'recent' ? 'active' : ''}`}
                                onClick={() => setActiveTab('recent')}
                            >
                                <IconClock /> Recent
                            </button>
                        </div>

                        <div className="fs-filter-wrap">
                            <button
                                className={`fs-filter-btn ${sortOpen || selectedModel || selectedPort ? 'active' : ''}`}
                                onClick={() => setSortOpen((o) => !o)}
                            >
                                <IconFilter /> Filter{activeFilterCount ? ` · ${activeFilterCount}` : ''}
                            </button>
                            {sortOpen && (
                                <div className="fs-filter-dropdown">
                                    <div className="fs-filter-section-label">Sort stations by</div>
                                    {SORT_OPTIONS.map((opt) => (
                                        <button
                                            type="button"
                                            key={opt}
                                            className={`fs-filter-item ${opt === sortBy ? 'active' : ''}`}
                                            onClick={() => setSortBy(opt)}
                                        >
                                            <span>{opt}</span>
                                            {opt === sortBy ? <IconCheck /> : <span style={{ color: 'var(--text-secondary)' }}>›</span>}
                                        </button>
                                    ))}
                                    <div className="fs-filter-divider" />
                                    <div className="fs-filter-section-label">Vehicle model</div>
                                    <div className="fs-filter-options">
                                        {VEHICLE_MODELS.map((model) => (
                                            <button
                                                type="button"
                                                key={model}
                                                className={`fs-filter-chip ${selectedModel === model ? 'active' : ''}`}
                                                onClick={() => setSelectedModel(selectedModel === model ? '' : model)}
                                            >
                                                {model}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="fs-filter-section-label">Charging port</div>
                                    <div className="fs-filter-options">
                                        {CHARGING_PORTS.map((port) => (
                                            <button
                                                type="button"
                                                key={port}
                                                className={`fs-filter-chip ${selectedPort === port ? 'active' : ''}`}
                                                onClick={() => setSelectedPort(selectedPort === port ? '' : port)}
                                            >
                                                {port}
                                            </button>
                                        ))}
                                    </div>
                                    {(selectedModel || selectedPort) && (
                                        <button type="button" className="fs-filter-clear" onClick={() => { setSelectedModel(''); setSelectedPort(''); }}>
                                            Clear selections
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="fs-list">
                        {displayedStations.map((s) => {
                            const isSelected = s.id === safeSelected.id;
                            const isFav = !!favorites[s.id];
                            const availPlugs = s.pluggedAvailable ?? (s.portsCount ? s.portsCount - 1 : 4);
                            const totalPlugs = s.pluggedTotal ?? (s.portsCount || 6);
                            const availClass = s.status === 'full' ? 'full' : s.status === 'soon' ? 'soon' : 'available';

                            return (
                                <div
                                    key={s.id}
                                    className={`fs-list-row ${isSelected ? 'selected' : ''}`}
                                    onClick={() => setSelectedId(s.id)}
                                >
                                    <div className={`fs-list-badge ${s.status}`}>
                                        <IconPin />
                                    </div>
                                    <div className="fs-list-info">
                                        <div className="fs-list-title-row">
                                            <span className="fs-list-name">{s.name}</span>
                                            {isFav && <span className="fs-fav-heart"><IconHeart filled /></span>}
                                        </div>
                                        <div className="fs-list-address">{s.address}</div>
                                    </div>
                                    <div className="fs-list-right">
                                        <span className="fs-list-time">
                                            <IconClock /> {s.distanceMins || 15} min away
                                        </span>
                                        <span className={`fs-list-plugs-pill ${availClass}`}>
                                            {availPlugs} / {totalPlugs} Plugs
                                        </span>
                                        <button
                                            className="fs-list-action-btn"
                                            onClick={(e) => { e.stopPropagation(); toggleFavorite(s.id); }}
                                            aria-label="Toggle favorite"
                                        >
                                            {isSelected ? (
                                                <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M7.5 4l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            ) : (
                                                <IconHeart filled={isFav} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        {displayedStations.length === 0 && (
                            <div className="fs-list-empty">
                                No stations found.
                            </div>
                        )}
                    </div>
                </div>

                <div className="fs-right">
                    <div className="fs-station-panel">
                        {/* Top banner image with overlay heart button */}
                        <div className="fs-panel-banner">
                            <img src={safeSelected.image} alt={safeSelected.name} />
                            <button
                                className={`fs-panel-fav-btn ${favorites[safeSelected.id] ? 'active' : ''}`}
                                onClick={(e) => { e.stopPropagation(); toggleFavorite(safeSelected.id); }}
                                aria-label="Favorite station"
                            >
                                <IconHeart filled={!!favorites[safeSelected.id]} />
                            </button>
                        </div>

                        {/* Title & Location */}
                        <div className="fs-panel-info">
                            <h2 className="fs-panel-name">{safeSelected.name}</h2>
                            <div className="fs-panel-address">
                                <IconPin />
                                <span>{safeSelected.address}</span>
                            </div>
                        </div>

                        {/* Rating & Open status pill */}
                        <div className="fs-panel-rating-row">
                            <div className="fs-panel-rating">
                                <span className="fs-star-icon"><IconStarFilled /></span>
                                <span className="fs-rating-val">{(safeSelected.rating || 4.1).toFixed(1)}</span>
                                <span className="fs-rating-count">({safeSelected.reviews || 0})</span>
                            </div>
                            <div className="fs-panel-open-pill">
                                {safeSelected.openHours || 'Open 24 hrs'}
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="fs-panel-tags">
                            {(safeSelected.tags || ['Type 2', 'CCS2', 'AC', 'DC Fast']).map((t) => (
                                <span key={t} className="fs-panel-tag">{t}</span>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="fs-panel-divider" />

                        {/* Live Charging Bays */}
                        <div className="fs-bays-section">
                            <div className="fs-bays-header">
                                <span className="fs-bays-title">Live Charging Bays</span>
                                <button className="fs-bays-see-all" onClick={() => goDetails(safeSelected.id)}>See all</button>
                            </div>
                            <div className="fs-bays-hint">Tap on a available bay to book it</div>

                            <div className="fs-bays-row">
                                <div className="fs-bays-grid">
                                    {baysData.slice(0, 4).map((b, i) => (
                                        <div
                                            key={i}
                                            className={`fs-bay-card ${b.status} ${selectedBay === i ? 'selected' : ''}`}
                                            onClick={() => setSelectedBay(selectedBay === i ? null : i)}
                                        >
                                            <span className="fs-bay-name">{b.name}</span>
                                            <div className={`fs-bay-icon-wrap ${b.status}`}>
                                                <IconPlug />
                                            </div>
                                            <span className={`fs-bay-status-text ${b.status}`}>{b.label}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className="fs-bays-next-btn" aria-label="More bays" onClick={() => goDetails(safeSelected.id)}>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M7.5 4.5L13 10L7.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* 4 Info Boxes Grid */}
                        <div className="fs-metrics-grid">
                            <div className="fs-metric-card">
                                <span className="fs-metric-label">Pricing</span>
                                <span className="fs-metric-value">{safeSelected.pricingText || 'LKR 85 / kWh'}</span>
                            </div>
                            <div className="fs-metric-card">
                                <span className="fs-metric-label">Idle Fee</span>
                                <span className="fs-metric-value">{safeSelected.idleFeeText || 'LKR 10 / min'}</span>
                            </div>
                            <div className="fs-metric-card">
                                <span className="fs-metric-label">Parking</span>
                                <span className="fs-metric-value">{safeSelected.parkingText || 'Free'}</span>
                            </div>
                            <div className="fs-metric-card">
                                <span className="fs-metric-label">Amenities</span>
                                <span className="fs-metric-value">{safeSelected.amenitiesText || 'Wi-Fi, Cafe'}</span>
                            </div>
                        </div>

                        {/* ETA & Distance */}
                        <div className="fs-eta-row">
                            <div className="fs-eta-left">
                                <IconClock />
                                <span>{safeSelected.distanceMins || 20} mins away</span>
                            </div>
                            <div className="fs-eta-right">
                                <span>{safeSelected.distanceKm || '3.7'} km</span>
                                <IconCarSmall />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="fs-panel-btn-row">
                            <button className="btn-details-pill" onClick={() => goDetails(safeSelected.id)}>Details</button>
                            <button
                                className="btn-directions-pill"
                                onClick={() => window.open(directionsUrl(safeSelected), '_blank', 'noopener,noreferrer')}
                            >
                                Directions <span className="arrow-icon">↗</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const FindStation = () => {
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState('volt-charge-cod');
    const [search, setSearch] = useState('');
    const [sortOpen, setSortOpen] = useState(false);
    const [sortBy, setSortBy] = useState('Nearby');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedPort, setSelectedPort] = useState('');
    const [activeTab, setActiveTab] = useState('nearby');
    const [favorites, setFavorites] = useState({ 'volt-charge-cod': true, 'one-galle-face': true });
    const [menuOpen, setMenuOpen] = useState(false);
    const [favOpen, setFavOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [routeOn, setRouteOn] = useState(true);
    const [locating, setLocating] = useState(false);

    const selected = STATIONS.find((s) => s.id === selectedId) || STATIONS[6] || STATIONS[0];
    const goDetails = (id) => navigate(`/station/${id}`);
    const toggleFavorite = (id) => setFavorites((f) => ({ ...f, [id]: !f[id] }));

    const onLocate = () => {
        setZoom(1);
        setLocating(true);
        setTimeout(() => setLocating(false), 700);
    };

    // Close popouts / sort menu on outside click.
    useEffect(() => {
        const onDocClick = (e) => {
            if (!e.target.closest('.fs-popout-anchor')) { setFavOpen(false); setNotifOpen(false); }
            if (!e.target.closest('.fs-filter-wrap')) setSortOpen(false);
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    const shared = {
        selected, setSelectedId, search, setSearch, sortOpen, setSortOpen,
        sortBy, setSortBy, favorites, toggleFavorite, goDetails,
        favOpen, setFavOpen, notifOpen, setNotifOpen, zoom, setZoom,
        routeOn, setRouteOn, locating, onLocate, activeTab, setActiveTab,
        selectedModel, setSelectedModel, selectedPort, setSelectedPort,
    };

    return (
        <>
            {/* ---------- Desktop ---------- */}
            <div className="app-shell">
                <Sidebar />
                <main className="app-main">
                    <FindStationContent {...shared} />
                </main>
            </div>

            {/* ---------- Mobile ---------- */}
            <div className="mobile-only" style={{ padding: '16px' }}>
                <div className="nav-bar" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <button className="nav-hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu" style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                        <IconMenu />
                    </button>
                    <span className="nav-title" style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>Find Your Station</span>
                </div>
                <div>
                    <FindStationContent {...shared} />
                </div>
                <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} active="/dashboard" />
            </div>
        </>
    );
};

export default FindStation;
