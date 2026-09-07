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
import { getDirectionsUrl } from '../utils/directions';
import { getStationImages } from '../utils/stationImageHelper';
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

// Map layout coordinates (% of map container) for stations across Sri Lanka / Colombo corridors
const MAP_POSITIONS = {
    'one-galle-face': { x: 34, y: 38 },
    'colombo-city-center': { x: 38, y: 28 },
    'independence-arcade': { x: 44, y: 46 },
    'havelock-city': { x: 42, y: 58 },
    'morven-hotel': { x: 32, y: 48 },
    'vedrive-station': { x: 50, y: 34 },
    'volt-charge-cod': { x: 28, y: 64 },
    'cinnamon-grand-colombo': { x: 30, y: 42 },
    'branch-cinnamon-grand-colombo-1788819001001': { x: 30, y: 42 },
    'kandy-city-centre': { x: 74, y: 22 },
    'branch-kcc-kandy-1788819002002': { x: 74, y: 22 },
    'galle-fort-heritage-station': { x: 38, y: 84 },
    'branch-galle-fort-1788819003003': { x: 38, y: 84 },
    'southern-expressway-welipenna': { x: 56, y: 72 },
    'branch-welipenna-e01-1788819004004': { x: 56, y: 72 },
    'branch-keells-kaduwela-1788819005005': { x: 64, y: 36 },
    'branch-keells-union-place-1788819006006': { x: 36, y: 32 },
    'branch-keells-kohuwala-1788819007007': { x: 48, y: 60 },
    'branch-s-ev-charging-colombo-1788818271550': { x: 68, y: 30 },
};

const getPos = (stationOrId) => {
    if (!stationOrId) return { x: 45, y: 45 };
    const id = typeof stationOrId === 'object'
        ? (stationOrId.slug || stationOrId.branchId || stationOrId.id || '')
        : String(stationOrId);

    if (MAP_POSITIONS[id]) return MAP_POSITIONS[id];

    // Check partial slug matching
    for (const [k, pos] of Object.entries(MAP_POSITIONS)) {
        if (id.includes(k) || k.includes(id)) return pos;
    }

    const s = typeof stationOrId === 'object' ? stationOrId : {};
    if (s.lat && s.lng) {
        const x = Math.max(16, Math.min(84, Math.round(((s.lng - 79.7) / (80.9 - 79.7)) * 68 + 16)));
        const y = Math.max(16, Math.min(84, Math.round((1 - (s.lat - 5.9) / (7.5 - 5.9)) * 68 + 16)));
        return { x, y };
    }

    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = (hash << 5) - hash + id.charCodeAt(i);
    return {
        x: 18 + (Math.abs(hash) % 64),
        y: 20 + (Math.abs(hash >> 3) % 60),
    };
};

// Dynamic status evaluator for map pins, badges, and availability indicators
export const getStationStatus = (station) => {
    if (!station) return 'available';
    const status = (station.status || '').toLowerCase().trim();
    const total = station.pluggedTotal ?? (station.portsCount || (station.baysDetail?.length) || (station.bays?.length) || 4);
    const avail = station.pluggedAvailable ?? (
        Array.isArray(station.baysDetail)
            ? station.baysDetail.filter((b) => b && b.status === 'available').length
            : (Array.isArray(station.bays) ? station.bays.filter((b) => b === 'available' || b?.status === 'available').length : total)
    );

    if (status === 'full' || status === 'offline' || status === 'maintenance' || status === 'closed' || status === 'unavailable' || avail === 0) {
        return 'full';
    }
    if (status === 'soon' || status === 'limited' || status === 'busy' || status === 'coming_soon' || (avail > 0 && avail <= Math.max(1, Math.floor(total * 0.4)))) {
        return 'soon';
    }
    return 'available';
};

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
    stations,
    selected, setSelectedId, search, setSearch, sortOpen, setSortOpen,
    sortBy, setSortBy, favorites, toggleFavorite, goDetails,
    favOpen, setFavOpen, notifOpen, setNotifOpen, zoom, setZoom,
    routeOn, setRouteOn, locating, onLocate, activeTab, setActiveTab,
    selectedModel, setSelectedModel, selectedPort, setSelectedPort,
}) => {
    const favBtnRef = useRef(null);
    const notifBtnRef = useRef(null);
    const [selectedBay, setSelectedBay] = useState(null);

    const safeSelected = selected || (stations && stations[0]);

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
        let list = stations || [];
        if (activeTab === 'favorites') {
            list = list.filter((s) => favorites[s.id]);
        } else if (activeTab === 'recent') {
            const recentIds = ['colombo-city-center', 'morven-hotel', 'one-galle-face'];
            list = list.filter((s) => recentIds.includes(s.id));
        }
        const term = search.trim().toLowerCase();
        return list
            .filter((s) => !selectedModel || s.supportedModels?.includes(selectedModel))
            .filter((s) => !selectedPort || stationHasPort(s, selectedPort))
            .filter((s) => !term || s.name.toLowerCase().includes(term) || s.address.toLowerCase().includes(term))
            .sort(sortComparator(sortBy));
    }, [stations, search, activeTab, favorites, sortBy, selectedModel, selectedPort]);

    const favoriteStations = useMemo(
        () => (stations || []).filter((s) => favorites[s.id]),
        [stations, favorites],
    );

    const selectedPos = getPos(safeSelected.id);
    const highestSpeed = Math.max(...displayedStations.map((station) => station.maxChargingSpeedKw || 0));
    const showMapMetric = sortBy === 'Ratings' || sortBy === 'Charging Speed';
    const activeFilterCount = Number(Boolean(selectedModel)) + Number(Boolean(selectedPort));

    return (
        <>
            <header className="fs-topbar">
                <div className="fs-header-titles">
                    <h1 className="fs-page-title">Find Your Station</h1>
                    <p className="fs-page-subtitle">
                        Explore real-time charging stations, live bay availability, and reserve your slot.
                    </p>
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
            </header>

            <div className="fs-grid">
                <div className="fs-left">
                    <div className="fs-map-card">
                        <div
                            className="fs-map-zoom-wrap"
                            style={{ transform: `scale(${zoom})` }}
                        >
                            <svg className="fs-map-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                                {/* Water shading & Land Boundary */}
                                <path d="M 22 0 C 26 20, 24 45, 28 70 C 31 85, 36 100, 36 100 L 0 100 L 0 0 Z" fill="rgba(2, 22, 31, 0.45)" />
                                <path d="M 22 0 C 26 20, 24 45, 28 70 C 31 85, 36 100, 36 100" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.8" strokeDasharray="3 3" fill="none" />

                                {/* Urban Street Grid Lines */}
                                <line x1="20" y1="20" x2="85" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                                <line x1="25" y1="40" x2="88" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                                <line x1="30" y1="60" x2="90" y2="60" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                                <line x1="35" y1="80" x2="90" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                                <line x1="30" y1="10" x2="30" y2="90" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                                <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                                <line x1="70" y1="10" x2="70" y2="90" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

                                {/* A1 Highway Corridor to Kandy */}
                                <path d="M 32 30 Q 50 24 74 22" stroke="rgba(255, 255, 255, 0.09)" strokeWidth="1.2" fill="none" />

                                {/* Galle Road / Marine Drive Coastal Arterial */}
                                <path d="M 30 15 Q 32 45 38 75 T 38 88" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1.4" fill="none" />

                                {/* E01 Southern Expressway Corridor */}
                                <path d="M 40 55 Q 50 64 56 72 T 44 90" stroke="rgba(255, 255, 255, 0.11)" strokeWidth="1.4" fill="none" />

                                {/* East-West Urban Corridors (Kaduwela / Outer Circular) */}
                                <path d="M 30 35 Q 48 38 68 30 T 95 28" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.0" fill="none" />
                                <path d="M 28 55 Q 48 58 72 52" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="0.9" fill="none" />

                                {/* Geographic Area Labels */}
                                <text x="24" y="24" fill="rgba(138,158,168,0.35)" fontSize="2.8" fontWeight="bold" letterSpacing="0.5">COLOMBO</text>
                                <text x="70" y="16" fill="rgba(138,158,168,0.35)" fontSize="2.8" fontWeight="bold" letterSpacing="0.5">KANDY</text>
                                <text x="58" y="26" fill="rgba(138,158,168,0.25)" fontSize="2.2">KADUWELA</text>
                                <text x="56" y="66" fill="rgba(138,158,168,0.3)" fontSize="2.2" fontWeight="bold" letterSpacing="0.4">E01 EXPRESSWAY</text>
                                <text x="40" y="94" fill="rgba(138,158,168,0.35)" fontSize="2.8" fontWeight="bold" letterSpacing="0.5">GALLE</text>

                                {/* Interactive Animated Route Path to selected station */}
                                {routeOn && (
                                    <path
                                        d={`M 18 8 Q ${(18 + selectedPos.x) / 2 + 3} ${(8 + selectedPos.y) / 2 - 3} ${selectedPos.x} ${selectedPos.y}`}
                                        stroke="#3DDC97"
                                        strokeWidth="1.4"
                                        strokeDasharray="3 2"
                                        fill="none"
                                    />
                                )}
                            </svg>

                            <div
                                className="fs-map-you"
                                style={{
                                    left: '18%', top: '8%',
                                    boxShadow: locating ? '0 0 0 16px rgba(9,209,199,0.02)' : undefined,
                                }}
                                title="You are here (Current Location)"
                            />

                            {(stations || []).map((s) => {
                                const pos = getPos(s);
                                const isHighestSpeed = sortBy === 'Charging Speed' && (s.maxChargingSpeedKw || 0) === highestSpeed;
                                const statusClass = getStationStatus(s);
                                return (
                                    <div
                                        key={s.id}
                                        className={`fs-map-pin ${statusClass} ${s.id === safeSelected.id ? 'selected' : ''} ${isHighestSpeed ? 'highlighted' : ''}`}
                                        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                                        onClick={() => setSelectedId(s.id)}
                                        title={`${s.name} (${s.address || ''}) · ${statusClass === 'available' ? 'Available' : statusClass === 'soon' ? 'Soon Available' : 'Full / Closed'}`}
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
                            const statusClass = getStationStatus(s);

                            return (
                                <div
                                    key={s.id}
                                    className={`fs-list-row ${isSelected ? 'selected' : ''}`}
                                    onClick={() => setSelectedId(s.id)}
                                >
                                    <div className={`fs-list-badge ${statusClass}`}>
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
                                        <span className={`fs-list-plugs-pill ${statusClass}`}>
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
                                            onClick={() => {
                                                setSelectedBay(i);
                                                goDetails(safeSelected.id, b.bayId || b.id || `bay-${i + 1}`);
                                            }}
                                            title={`Click to view ${b.name} details`}
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
                            <button
                                className="btn-details-pill"
                                onClick={() => goDetails(safeSelected.id, selectedBay !== null ? (baysData[selectedBay]?.bayId || `bay-${selectedBay + 1}`) : undefined)}
                            >
                                Details
                            </button>
                            <button
                                className="btn-book-charger-pill"
                                style={{
                                    background: '#3DDC97',
                                    color: '#031C26',
                                    fontWeight: '600',
                                    padding: '8px 18px',
                                    borderRadius: '999px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '0.88rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    letterSpacing: '0.01em',
                                    transition: 'all 0.2s ease',
                                }}
                                onClick={() => {
                                    const bay = selectedBay !== null ? (baysData[selectedBay]?.bayId || `bay-${selectedBay + 1}`) : 'bay-1';
                                    navigate(`/book-charger?station=${safeSelected.id || safeSelected.slug}&bay=${bay}`, {
                                        state: { station: safeSelected }
                                    });
                                }}
                            >
                                Book Charger
                            </button>
                            <button
                                className="btn-directions-pill"
                                onClick={() => {
                                    const url = getDirectionsUrl(safeSelected);
                                    if (url) window.open(url, '_blank', 'noopener,noreferrer');
                                }}
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
    const [stations, setStations] = useState(STATIONS);
    const [selectedId, setSelectedId] = useState(() => {
        try {
            return sessionStorage.getItem('evora_selected_station') || 'branch-cinnamon-grand-colombo-1788819001001';
        } catch {
            return 'branch-cinnamon-grand-colombo-1788819001001';
        }
    });
    const [search, setSearch] = useState('');
    const [sortOpen, setSortOpen] = useState(false);
    const [sortBy, setSortBy] = useState('Nearby');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedPort, setSelectedPort] = useState('');
    const [activeTab, setActiveTab] = useState('nearby');
    const [favorites, setFavorites] = useState({ 'branch-cinnamon-grand-colombo-1788819001001': true, 'branch-welipenna-e01-1788819004004': true });
    const [menuOpen, setMenuOpen] = useState(false);
    const [favOpen, setFavOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [routeOn, setRouteOn] = useState(true);
    const [locating, setLocating] = useState(false);

    // Persist selected station id across refresh
    const handleSelectStation = (id) => {
        setSelectedId(id);
        try { sessionStorage.setItem('evora_selected_station', id); } catch {}
    };

    // Fetch from backend API; silently keep local data if API is unreachable
    useEffect(() => {
        const params = new URLSearchParams({ limit: 50, page: 1 });
        if (search.trim()) params.set('search', search.trim());
        if (sortBy && sortBy !== 'Nearby') params.set('sortBy', sortBy);
        if (selectedModel) params.set('model', selectedModel);
        if (selectedPort) params.set('port', selectedPort);

        fetch(`/api/stations?${params.toString()}`)
            .then((res) => {
                if (!res.ok) throw new Error('api error');
                return res.json();
            })
            .then((json) => {
                const list = (json.data || []).map((s, idx) => {
                    const stationId = s.slug || s.branchId || s.id;
                    const { image, images } = getStationImages(s, idx);
                    return {
                        ...s,
                        id: stationId,
                        slug: s.slug || stationId,
                        image: (s.image && s.image.trim()) ? s.image : image,
                        images: (s.images && s.images.length && s.images[0]) ? s.images : images,
                    };
                });
                if (list.length > 0) setStations(list);
            })
            .catch(() => {
                setStations(STATIONS);
            });
    }, [search, sortBy, selectedModel, selectedPort]);

    const selected = stations.find((s) => s.id === selectedId) || stations[0] || STATIONS[0];
    const goDetails = (id, bayId) => navigate(bayId ? `/station/${id}?bay=${bayId}` : `/station/${id}`);
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
        stations,
        selected, setSelectedId: handleSelectStation, search, setSearch, sortOpen, setSortOpen,
        sortBy, setSortBy, favorites, toggleFavorite, goDetails,
        favOpen, setFavOpen, notifOpen, setNotifOpen, zoom, setZoom,
        routeOn, setRouteOn, locating, onLocate, activeTab, setActiveTab,
        selectedModel, setSelectedModel, selectedPort, setSelectedPort,
    };

    return (
        <>
            {/* ---------- Desktop ---------- */}
            <div className="app-shell find-station-page">
                <Sidebar />
                <main className="app-main">
                    <FindStationContent {...shared} />
                </main>
            </div>

            {/* ---------- Mobile ---------- */}
            <div className="mobile-only find-station-page" style={{ padding: '16px' }}>
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
