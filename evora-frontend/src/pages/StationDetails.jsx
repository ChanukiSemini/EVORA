// ============================================
// src/pages/StationDetails.jsx
// Station Details page, reached from the Home
// page's "Details" button (/station/:id).
// "Book Your Charger" is intentionally just a
// placeholder message — no booking flow yet.
// ============================================

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';
import { getStationById, STATIONS } from '../data/stations';
import {
    IconBack, IconMenu, IconPin, IconStarFilled, IconPlug, IconClock,
    IconNav, IconCheck,
} from '../components/Icons';

const directionsUrl = (station) =>
    `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;

const StatusBar = ({ station }) => {
    if (station.status === 'full') {
        return <div className="sd-avail-bar full"><span className="fs-map-legend-dot full" /> Full — no bays available right now</div>;
    }
    if (station.status === 'soon') {
        return <div className="sd-avail-bar soon"><span className="fs-map-legend-dot soon" /> Soon available · {station.openHours}</div>;
    }
    return <div className="sd-avail-bar"><span className="fs-map-legend-dot available" /> Available Now · {station.openHours}</div>;
};

const DetailsContent = ({ station, onBook, onDirections }) => (
    <>
        <div className="sd-breadcrumb">
            <Link to="/dashboard">Find Stations</Link> &nbsp;›&nbsp; <span className="current">{station.name}</span>
        </div>

        <h1 className="sd-title">{station.name}</h1>
        <div className="sd-subtitle">{station.network}</div>

        <StatusBar station={station} />

        <div className="sd-address"><IconPin /> {station.address}</div>

        <div className="sd-grid">
            <div>
                <div className="sd-banner">
                    <img src={station.image} alt={station.name} />
                    <div className="sd-banner-badge"><IconPlug /></div>
                </div>

                <div className="sd-section-title">Charging Connectors</div>
                <div className="sd-connectors-grid">
                    {station.connectors.map((c) => (
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
            </div>

            <div>
                <div className="sd-info-grid">
                    <div className="sd-info-card">
                        <div className="sd-info-label"><IconNav /> Distance</div>
                        <div className="sd-info-value">{station.distanceKm} km</div>
                    </div>
                    <div className="sd-info-card">
                        <div className="sd-info-label"><IconClock /> ETA</div>
                        <div className="sd-info-value">{station.distanceMins} mins away</div>
                    </div>
                    <div className="sd-info-card">
                        <div className="sd-info-label"><IconPlug /> Availability</div>
                        <div className="sd-info-value">{station.pluggedAvailable}/{station.pluggedTotal} Plugs</div>
                    </div>
                    <div className="sd-info-card">
                        <div className="sd-info-label">💳 Price</div>
                        <div className="sd-info-value">{station.priceHeadline}</div>
                    </div>
                    <div className="sd-info-card">
                        <div className="sd-info-label"><IconClock /> Open Hours</div>
                        <div className="sd-info-value">{station.openHours}</div>
                    </div>
                    <div className="sd-info-card">
                        <div className="sd-info-label"><IconStarFilled /> Rating</div>
                        <div className="sd-info-value">{station.rating.toFixed(1)} ★ ({station.reviews})</div>
                    </div>
                    <div className="sd-info-card full">
                        <div className="sd-info-label">🅿️ Access Type</div>
                        <div className="sd-info-value">{station.accessType}</div>
                    </div>
                </div>

                <div className="sd-rates-card">
                    <div className="sd-rates-title">Price Rates</div>
                    <div className="sd-rate-row">
                        <span className="sd-rate-label">Fast Charging</span>
                        <span className="sd-rate-value">LKR {station.rates.fast} /kWh</span>
                    </div>
                    <div className="sd-rate-row">
                        <span className="sd-rate-label">Slow Charging</span>
                        <span className="sd-rate-value">LKR {station.rates.slow} /kWh</span>
                    </div>

                    <button className="btn-primary sd-book-btn" onClick={onBook}>Book Your Charger →</button>
                    <div className="sd-book-caption">🔒 Secure Booking · Instant Confirmation</div>

                    <button className="btn-ghost" style={{ marginTop: 10 }} onClick={onDirections}>Get Directions</button>
                </div>
            </div>
        </div>
    </>
);

const StationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const station = getStationById(id) || STATIONS[0];
    const [menuOpen, setMenuOpen] = useState(false);
    const [toast, setToast] = useState(false);

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(false), 3000);
        return () => clearTimeout(t);
    }, [toast]);

    const onBook = () => setToast(true);
    const onDirections = () => window.open(directionsUrl(station), '_blank', 'noopener,noreferrer');

    return (
        <>
            {/* ---------- Desktop ---------- */}
            <div className="app-shell">
                <Sidebar />
                <main className="app-main">
                    <DetailsContent station={station} onBook={onBook} onDirections={onDirections} />
                </main>
            </div>

            {/* ---------- Mobile ---------- */}
            <div className="mobile-only">
                <div className="evora-screen">
                    <div className="nav-bar">
                        <button className="nav-back" onClick={() => navigate(-1)} aria-label="Go back"><IconBack /></button>
                        <span className="nav-title">Station Details</span>
                        <button className="nav-hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
                            <IconMenu />
                        </button>
                    </div>
                    <div style={{ marginTop: 12 }}>
                        <DetailsContent station={station} onBook={onBook} onDirections={onDirections} />
                    </div>
                </div>
                <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} active="/dashboard" />
            </div>

            {toast && (
                <div className="sd-toast"><IconCheck /> &nbsp;Booking flow coming soon — stay tuned!</div>
            )}
        </>
    );
};

export default StationDetails;
