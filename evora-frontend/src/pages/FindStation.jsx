// ============================================
// src/pages/FindStation.jsx
// "Find Your Station" — Home / dashboard page.
// Desktop: <Sidebar/> + <main>. Mobile: hamburger
// + <MobileNav/> drawer. Same content is reused
// for both so nothing has to be kept in sync.
// ============================================

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';
import { STATIONS } from '../data/stations';
import {
    IconSearch, IconHeart, IconBell, IconMenu, IconChevronDown, IconCheck,
    IconStarFilled, IconPin, IconPlug, IconCarSmall, IconLocate, IconPlus,
    IconMinus, IconRoute,
} from '../components/Icons';

const SORT_OPTIONS = ['Nearby', 'Ratings', 'Charging Speed', 'Vehicle Model', 'Charging Port'];

// Fixed layout positions (percent of map card) so the pins line up
// with the little illustrated "roads" behind them.
const MAP_POSITIONS = {
    'one-galle-face': { x: 44, y: 78 },
    'colombo-city-center': { x: 30, y: 22 },
    'independence-arcade': { x: 33, y: 48 },
    'havelock-city': { x: 63, y: 55 },
};

const directionsUrl = (station) =>
    `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;

const FindStationContent = ({
    selected, setSelectedId, search, setSearch, sortOpen, setSortOpen,
    sortBy, setSortBy, favorites, toggleFavorite, goDetails,
}) => {
    const otherStations = useMemo(() => {
        const term = search.trim().toLowerCase();
        return STATIONS
            .filter((s) => s.id !== selected.id)
            .filter((s) => !term || s.name.toLowerCase().includes(term) || s.address.toLowerCase().includes(term));
    }, [search, selected.id]);

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
                    <button className="fs-icon-btn" aria-label="Favorites">
                        <IconHeart />
                        <span className="fs-icon-badge">{Object.keys(favorites).length || 1}</span>
                    </button>
                    <button className="fs-icon-btn" aria-label="Notifications">
                        <IconBell />
                    </button>
                </div>
            </div>

            <h1 className="fs-heading">Find Your Station</h1>

            <div className="fs-grid">
                <div className="fs-left">
                    <div className="fs-map-card">
                        <svg className="fs-map-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 30 Q 35 10 55 25 T 100 20" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" fill="none" />
                            <path d="M10 0 Q 20 40 15 60 T 30 100" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" fill="none" />
                            <path d="M60 0 Q 55 45 68 60 T 60 100" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" fill="none" />
                            <path
                                d={`M18 8 L ${MAP_POSITIONS[selected.id].x} ${MAP_POSITIONS[selected.id].y}`}
                                stroke="var(--accent-cyan)" strokeWidth="0.6" strokeDasharray="2 2" fill="none"
                            />
                        </svg>

                        <div className="fs-map-you" style={{ left: '18%', top: '8%' }} title="You are here" />

                        {STATIONS.map((s) => (
                            <div
                                key={s.id}
                                className={`fs-map-pin ${s.status} ${s.id === selected.id ? 'selected' : ''}`}
                                style={{ left: `${MAP_POSITIONS[s.id].x}%`, top: `${MAP_POSITIONS[s.id].y}%` }}
                                onClick={() => setSelectedId(s.id)}
                                title={s.name}
                            >
                                <div className="fs-map-pin-dot"><IconPlug /></div>
                            </div>
                        ))}

                        <div className="fs-map-controls">
                            <button className="fs-map-ctrl-btn" aria-label="Locate me"><IconLocate /></button>
                            <button className="fs-map-ctrl-btn" aria-label="Zoom in"><IconPlus /></button>
                            <button className="fs-map-ctrl-btn" aria-label="Zoom out"><IconMinus /></button>
                            <button className="fs-map-ctrl-btn" aria-label="Toggle route"><IconRoute /></button>
                        </div>

                        <div className="fs-map-legend">
                            <div className="fs-map-legend-title">Station Status</div>
                            <div className="fs-map-legend-item"><span className="fs-map-legend-dot available" /> Available</div>
                            <div className="fs-map-legend-item"><span className="fs-map-legend-dot soon" /> Soon Available</div>
                            <div className="fs-map-legend-item"><span className="fs-map-legend-dot full" /> Full / Closed</div>
                            <div className="fs-map-legend-item"><span className="fs-map-legend-line" /> Route path</div>
                        </div>
                    </div>

                    <div className="fs-list">
                        {otherStations.map((s) => (
                            <div key={s.id} className="fs-list-row" onClick={() => setSelectedId(s.id)}>
                                <span className={`fs-list-dot ${s.status}`} />
                                <div className="fs-list-info">
                                    <div className="fs-list-name">{s.name}</div>
                                    <div className="fs-list-address">{s.address}</div>
                                </div>
                                <div className="fs-list-right">
                                    <button
                                        className={`fs-list-heart ${favorites[s.id] ? 'active' : ''}`}
                                        onClick={(e) => { e.stopPropagation(); toggleFavorite(s.id); }}
                                        aria-label="Toggle favorite"
                                    >
                                        <IconHeart filled={!!favorites[s.id]} />
                                    </button>
                                    {s.distanceMins} mins away
                                </div>
                            </div>
                        ))}
                        {otherStations.length === 0 && (
                            <div className="fs-list-row" style={{ cursor: 'default', color: 'var(--text-secondary)' }}>
                                No stations match "{search}"
                            </div>
                        )}
                    </div>
                </div>

                <div className="fs-right">
                    <div className="fs-sort-wrap">
                        <button className="fs-sort-btn" onClick={() => setSortOpen((o) => !o)}>
                            Sort by: <strong>{sortBy}</strong> <IconChevronDown open={sortOpen} />
                        </button>
                        {sortOpen && (
                            <div className="fs-sort-menu">
                                {SORT_OPTIONS.map((opt) => (
                                    <div
                                        key={opt}
                                        className={`fs-sort-item ${opt === sortBy ? 'active' : ''}`}
                                        onClick={() => { setSortBy(opt); setSortOpen(false); }}
                                    >
                                        {opt} {opt === sortBy ? <IconCheck /> : <span style={{ color: 'var(--text-secondary)' }}>›</span>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="fs-station-panel">
                        <div className="fs-panel-top">
                            <div className="fs-panel-img">
                                <img src={selected.image} alt={selected.name} />
                                <span className="fs-panel-img-badge"><IconPlug /></span>
                            </div>
                            <div>
                                <div className="fs-panel-name">{selected.name}</div>
                                <div className="fs-panel-address"><IconPin /> {selected.address}</div>
                            </div>
                        </div>

                        <div className="fs-panel-rating-row">
                            <span className="fs-panel-rating">
                                <IconStarFilled /> {selected.rating.toFixed(1)} <span className="count">({selected.reviews})</span>
                            </span>
                            <span className="fs-panel-avail-pill">
                                <span className="fs-map-legend-dot available" />
                                {selected.pluggedAvailable}/{selected.pluggedTotal} Plugs
                            </span>
                        </div>

                        <div className="fs-panel-tags">
                            {selected.tags.map((t) => <span key={t} className="fs-panel-tag">{t}</span>)}
                        </div>

                        <div className="fs-panel-divider" />

                        <div className="fs-panel-bays-label">Live Charging Bays</div>
                        <div className="fs-panel-bays-hint">Tap an available bay to select it</div>
                        <div className="fs-bays-grid">
                            {selected.bays.map((b, i) => (
                                <div key={i} className={`fs-bay ${b}`}>
                                    <IconCarSmall crossed={b === 'unavailable'} />
                                </div>
                            ))}
                        </div>

                        <div className="fs-panel-eta-row">⏱ {selected.distanceMins} mins away</div>

                        <div className="fs-panel-btn-row">
                            <button className="btn-ghost" onClick={() => goDetails(selected.id)}>Details</button>
                            <button
                                className="btn-primary"
                                onClick={() => window.open(directionsUrl(selected), '_blank', 'noopener,noreferrer')}
                            >
                                Directions ↗
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
    const [selectedId, setSelectedId] = useState(STATIONS[0].id);
    const [search, setSearch] = useState('');
    const [sortOpen, setSortOpen] = useState(false);
    const [sortBy, setSortBy] = useState('Nearby');
    const [favorites, setFavorites] = useState({ 'one-galle-face': true });
    const [menuOpen, setMenuOpen] = useState(false);

    const selected = STATIONS.find((s) => s.id === selectedId) || STATIONS[0];
    const goDetails = (id) => navigate(`/station/${id}`);
    const toggleFavorite = (id) => setFavorites((f) => ({ ...f, [id]: !f[id] }));

    const shared = {
        selected, setSelectedId, search, setSearch, sortOpen, setSortOpen,
        sortBy, setSortBy, favorites, toggleFavorite, goDetails,
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
            <div className="mobile-only">
                <div className="evora-screen">
                    <div className="nav-bar">
                        <button className="nav-hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
                            <IconMenu />
                        </button>
                        <span className="nav-title">Find Your Station</span>
                    </div>
                    <div style={{ marginTop: 12 }}>
                        <FindStationContent {...shared} />
                    </div>
                </div>
                <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} active="/dashboard" />
            </div>
        </>
    );
};

export default FindStation;
