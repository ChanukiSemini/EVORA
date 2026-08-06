// ============================================
// src/pages/MyVehicles.jsx
// EVORA - My Vehicles Page
// ============================================

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Sidebar from '../components/Sidebar';
import IconSprite from '../components/IconSprite';
import CarModel from '../components/CarModel.jsx';
import Icon from '../components/Icon.jsx';
import teslaModel_3 from '../assets/models/tesla_model_3.glb';

/* ---------- Mock Data ---------- */
const VEHICLE_DATABASE = {
    brands: ['Tesla', 'BMW', 'Nissan'],
    models: {
        'Tesla': [
            { name: 'Tesla Model 3', type: 'Sedan', connector: 'Type 2 / CCS', battery: '75 kWh', range: '405 km', modelPath: teslaModel_3 },
            { name: 'Tesla Model Y', type: 'SUV', connector: 'Type 2 / CCS', battery: '82 kWh', range: '533 km', modelPath: teslaModel_3 },
            { name: 'Tesla Model S', type: 'Sedan', connector: 'Type 2 / CCS', battery: '100 kWh', range: '634 km', modelPath: teslaModel_3 },
        ],
        'BMW': [
            { name: 'BMW i4', type: 'Gran Coupe', connector: 'CCS', battery: '83.9 kWh', range: '590 km', modelPath: teslaModel_3 },
            { name: 'BMW iX', type: 'SUV', connector: 'CCS', battery: '111.5 kWh', range: '630 km', modelPath: teslaModel_3 },
        ],
        'Nissan': [
            { name: 'Nissan Leaf', type: 'Hatchback', connector: 'CHAdeMO', battery: '40 kWh', range: '270 km', modelPath: teslaModel_3 },
            { name: 'Nissan Ariya', type: 'SUV', connector: 'CCS', battery: '87 kWh', range: '500 km', modelPath: teslaModel_3 },
        ],
    },
};

const INITIAL_VEHICLES = [
    {
        id: 1,
        name: 'My Tesla',
        brand: 'Tesla',
        model: 'Tesla Model 3',
        type: 'Sedan',
        connector: 'Type 2 / CCS',
        battery: '75 kWh',
        range: '405 km',
        status: 'Ready to charge',
        color: 'Midnight Blue',
    },
    {
        id: 2,
        name: 'Weekend EV',
        brand: 'BMW',
        model: 'BMW i4',
        type: 'Gran Coupe',
        connector: 'CCS',
        battery: '83.9 kWh',
        range: '590 km',
        status: 'Charging paused',
        color: 'Frozen Grey',
    },
];

/* ---------- Shared inline style for edit inputs / selects ---------- */
const editInputStyle = {
    width: '100%',
    background: 'rgba(2, 20, 27, 0.7)',
    border: '1px solid var(--border-accent-low)',
    borderRadius: '10px',
    color: '#fff',
    padding: '0.6rem 0.75rem',
    marginTop: '0.25rem',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-base)',
};

/* ─── Trash icon ─── */
const IconTrash = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
);

export default function MyVehicles() {
    const navigate = useNavigate();

    // ── Layout state ──
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // ── Vehicles state ──
    const [vehicles, setVehicles] = useState(INITIAL_VEHICLES);
    const [selectedVehicleId, setSelectedVehicleId] = useState(1);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const selectedVehicle = useMemo(
        () => vehicles.find((v) => v.id === selectedVehicleId) ?? vehicles[0],
        [vehicles, selectedVehicleId]
    );

    // ── Edit state ──
    const [editName, setEditName] = useState('');
    const [editBrand, setEditBrand] = useState('');
    const [editModel, setEditModel] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const enableEdit = () => setIsEditing(true);

    const saveAndExit = (updatedData) => {
        // TODO: send updated vehicle to backend API
        if (updatedData) {
            setVehicles((list) =>
                list.map((v) => (v.id === selectedVehicleId ? { ...v, ...updatedData } : v))
            );
        }
        setIsEditing(false);
    };

    useEffect(() => {
        if (isEditing) {
            setEditName(selectedVehicle.name);
            setEditBrand(selectedVehicle.brand || 'Tesla');
            setEditModel(selectedVehicle.model || 'Tesla Model 3');
        }
    }, [isEditing, selectedVehicle]);

    const activeModelData = useMemo(() => {
        const brand = isEditing ? editBrand : (selectedVehicle?.brand || 'Tesla');
        const modelName = isEditing ? editModel : selectedVehicle?.model;
        return (VEHICLE_DATABASE.models[brand] || []).find((m) => m.name === modelName) || null;
    }, [isEditing, editBrand, editModel, selectedVehicle]);

    const activeModelPath = useMemo(() => activeModelData?.modelPath || teslaModel_3, [activeModelData]);

    const availableModels = useMemo(() => {
        if (!editBrand) return [];
        return VEHICLE_DATABASE.models[editBrand] || [];
    }, [editBrand]);

    const handleBrandChange = (e) => {
        const brand = e.target.value;
        setEditBrand(brand);
        const modelsOfBrand = VEHICLE_DATABASE.models[brand] || [];
        setEditModel(modelsOfBrand[0]?.name || '');
    };

    const handleSaveSubmit = (e) => {
        e.preventDefault();
        const updatedFields = {
            name: editName,
            brand: editBrand,
            model: editModel,
            type: activeModelData?.type || selectedVehicle.type,
            connector: activeModelData?.connector || selectedVehicle.connector,
            battery: activeModelData?.battery || selectedVehicle.battery,
            range: activeModelData?.range || selectedVehicle.range,
        };
        saveAndExit(updatedFields);
    };

    /* ─── Delete helpers ─── */
    const vehicleToDelete = useMemo(() => vehicles.find((v) => v.id === deleteTarget), [vehicles, deleteTarget]);

    const confirmDelete = () => {
        // TODO: send DELETE request to backend
        setVehicles((list) => list.filter((v) => v.id !== deleteTarget));
        if (selectedVehicleId === deleteTarget) {
            const remaining = vehicles.filter((v) => v.id !== deleteTarget);
            setSelectedVehicleId(remaining[0]?.id ?? null);
        }
        setDeleteTarget(null);
    };

    const cancelDelete = () => setDeleteTarget(null);

    /* ---------- Shared page content ---------- */
    const VehiclesContent = () => {
        if (vehicles.length === 0) {
            return (
                <div className="vehicles-page">
                    <div className="empty-state">
                        <div className="empty-state-icon" style={{ borderColor: 'var(--border-accent-low)', color: 'var(--text-secondary)' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3.5 12.5 4.8 8.2c.2-.7.9-1.2 1.6-1.2h7.2c.7 0 1.4.5 1.6 1.2l1.3 4.3" />
                                <rect x="2.5" y="12.5" width="15" height="4" rx="1.3" />
                                <circle cx="6" cy="16.5" r="1.2" /><circle cx="14" cy="16.5" r="1.2" />
                            </svg>
                        </div>
                        <p className="empty-state-title">No vehicles yet</p>
                        <p className="empty-state-text">Add your first EV to get started with smart charging sessions.</p>
                        <button className="btn-primary" style={{ maxWidth: 240, marginTop: 8 }}>+ Add a Vehicle</button>
                    </div>
                </div>
            );
        }

        return (
            <div className="vehicles-page">
                {/* ── Hero card: 3D model viewer ── */}
                <section className="card vehicle-hero-card animate-card">
                    <div className="vehicle-hero-card__viewer">
                        <Canvas camera={{ position: [0, 0.7, 4.6], fov: 32 }} dpr={[1, 1.8]}>
                            <ambientLight intensity={0.8} />
                            <directionalLight position={[4, 6, 4]} intensity={1.45} color="#7dffd0" />
                            <pointLight position={[-3, 2, -3]} intensity={2.2} color="#4dbdff" />
                            <Environment preset="city" />
                            <CarModel autoRotate modelPath={activeModelPath} />
                            <OrbitControls enableZoom={false} enablePan={false} />
                        </Canvas>
                    </div>
                    <div className="vehicle-hero-card__content">
                        <div className="vehicle-hero-card__topline">
                            <br />
                        </div>
                        <h2>{selectedVehicle.name}</h2>
                        <div className="vehicle-hero-meta">
                            <span className="tag tag-upcoming">{selectedVehicle.type}</span>
                            <span className="tag tag-completed">{selectedVehicle.connector}</span>
                            <span className="chip soft">{selectedVehicle.battery}</span>
                        </div>
                    </div>
                </section>

                {/* ── Info grid: details + saved vehicles ── */}
                <form onSubmit={handleSaveSubmit} className="vehicle-info-grid animate-card" style={{ animationDelay: '70ms' }}>
                    {/* Left — vehicle detail / edit */}
                    <article className="card vehicle-detail-card">
                        <div className="vehicle-detail-card__header">
                            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>
                                Vehicle Details
                            </h3>
                            {!isEditing && (
                                <button className="icon-action" type="button" onClick={enableEdit} title="Edit vehicle">
                                    <Icon name="icon-edit" size={14} />
                                </button>
                            )}
                        </div>

                        <div className="vehicle-detail-list">
                            {[
                                {
                                    label: 'Nickname',
                                    view: selectedVehicle.name,
                                    edit: <input className="profile-edit-input" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="e.g. My Tesla" required style={editInputStyle} />,
                                },
                                {
                                    label: 'Brand',
                                    view: selectedVehicle.brand || 'Tesla',
                                    edit: (
                                        <select value={editBrand} onChange={handleBrandChange} required style={editInputStyle}>
                                            <option value="" disabled>Select Brand</option>
                                            {VEHICLE_DATABASE.brands.map((b) => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                    ),
                                },
                                {
                                    label: 'Model',
                                    view: selectedVehicle.model,
                                    edit: (
                                        <select value={editModel} onChange={(e) => setEditModel(e.target.value)} disabled={!editBrand} required style={editInputStyle}>
                                            <option value="" disabled>Select Model</option>
                                            {availableModels.map((m) => <option key={m.name} value={m.name}>{m.name}</option>)}
                                        </select>
                                    ),
                                },
                                {
                                    label: 'Battery Capacity',
                                    view: selectedVehicle.battery,
                                    edit: <input value={activeModelData?.battery || ''} readOnly placeholder="Autofilled" style={{ ...editInputStyle, opacity: 0.5, cursor: 'not-allowed' }} />,
                                },
                                {
                                    label: 'Connector Type',
                                    view: selectedVehicle.connector,
                                    edit: <input value={activeModelData?.connector || ''} readOnly placeholder="Autofilled" style={{ ...editInputStyle, opacity: 0.5, cursor: 'not-allowed' }} />,
                                },
                                {
                                    label: 'Range',
                                    view: selectedVehicle.range,
                                    edit: <input value={activeModelData?.range || ''} readOnly placeholder="Autofilled" style={{ ...editInputStyle, opacity: 0.5, cursor: 'not-allowed' }} />,
                                },
                            ].map(({ label, view, edit }) => (
                                <div className="form-group-item" key={label}>
                                    <span className="profile-label">{label}</span>
                                    {isEditing ? edit : (
                                        <div className="profile-value" style={{ marginTop: '0.25rem' }}>{view}</div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {!isEditing ? (
                                <button className="btn-secondary" type="button" onClick={enableEdit}>
                                    <Icon name="icon-edit" size={14} />
                                    <span>Edit Information</span>
                                </button>
                            ) : (
                                <>
                                    <button className="btn-primary" type="submit">Save Changes</button>
                                    <button className="btn-ghost" type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                                </>
                            )}
                        </div>
                    </article>

                    {/* Right — saved vehicles list */}
                    <article className="card vehicle-detail-card">
                        <div className="vehicle-detail-card__header">
                            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>
                                Saved Vehicles
                            </h3>
                            <span className="tag tag-upcoming" style={{ fontSize: '10px' }}>{vehicles.length}</span>
                        </div>

                        <div className="vehicle-pill-list">
                            {vehicles.map((vehicle) => (
                                <div
                                    key={vehicle.id}
                                    className={`vehicle-chip ${selectedVehicleId === vehicle.id ? 'active' : ''}`}
                                    style={isEditing ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                                >
                                    <button
                                        type="button"
                                        style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', flex: 1, textAlign: 'left', padding: 0 }}
                                        onClick={() => setSelectedVehicleId(vehicle.id)}
                                        disabled={isEditing}
                                    >
                                        <span style={{ display: 'block', fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>
                                            {vehicle.name}
                                        </span>
                                        <small style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>{vehicle.model}</small>
                                    </button>
                                    {/* Delete button */}
                                    <button
                                        type="button"
                                        className="icon-action danger"
                                        title={`Remove ${vehicle.name}`}
                                        onClick={(e) => { e.stopPropagation(); setDeleteTarget(vehicle.id); }}
                                        disabled={isEditing}
                                        style={{ flexShrink: 0, opacity: isEditing ? 0.3 : 1 }}
                                    >
                                        <IconTrash />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            className="btn-secondary"
                            type="button"
                            disabled={isEditing}
                            style={{ marginTop: '1rem', opacity: isEditing ? 0.4 : 1 }}
                        >
                            + Add Vehicle
                        </button>
                    </article>
                </form>

                {/* ── Delete Confirmation Modal ── */}
                {deleteTarget && vehicleToDelete && (
                    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Delete vehicle confirmation">
                        <div className="modal-card">
                            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(239,68,68,0.12)', border: '1.5px solid var(--status-cancelled)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)' }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--status-cancelled)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                    <path d="M10 11v6M14 11v6" />
                                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                </svg>
                            </div>
                            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', textAlign: 'center', marginBottom: 'var(--space-2)' }}>
                                Remove Vehicle?
                            </h3>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.6, marginBottom: 'var(--space-6)' }}>
                                Remove <strong style={{ color: 'var(--text-primary)' }}>{vehicleToDelete.name}</strong>?
                                This can't be undone.
                            </p>
                            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                <button className="btn-secondary" type="button" onClick={cancelDelete} style={{ flex: 1 }}>
                                    Cancel
                                </button>
                                <button className="btn-danger-filled" type="button" onClick={confirmDelete} style={{ flex: 1 }}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <IconSprite />

            {/* ════════════════════════════════
                MOBILE LAYOUT (hidden ≥ 768px)
                ════════════════════════════════ */}
            <div className="evora-screen mobile-only">
                <div className="nav-bar">
                    <button className="nav-back" onClick={() => navigate(-1)} title="Back">←</button>
                    <span className="nav-title">My Vehicles</span>
                    <button className="nav-hamburger" onClick={() => setIsMobileMenuOpen(true)} title="Menu">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                            <line x1="4" y1="6" x2="20" y2="6" />
                            <line x1="4" y1="12" x2="20" y2="12" />
                            <line x1="4" y1="18" x2="20" y2="18" />
                        </svg>
                    </button>
                </div>

                <VehiclesContent />

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
                                <div className="mobile-menu-item" onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}>
                                    <span>⭐</span> Rate Your Session
                                </div>
                                <div className="mobile-menu-item active" onClick={() => { navigate('/vehicles'); setIsMobileMenuOpen(false); }}>
                                    <span>🚗</span> My Vehicles
                                </div>
                                <div className="mobile-menu-item" onClick={() => { navigate('/settings'); setIsMobileMenuOpen(false); }}>
                                    <span>⚙️</span> Settings
                                </div>
                            </nav>
                            <div className="mobile-menu-footer">
                                <div className="mobile-user-card">
                                    <div className="mobile-user-avatar" onClick={() => navigate('/profile')} role="button" tabIndex={0}>SJ</div>
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
                            <h1 className="dt-page-title">My Vehicles</h1>
                            <p className="dt-page-subtitle">Manage your registered electric vehicles</p>
                        </div>
                    </div>
                    <div className="dt-content">
                        <VehiclesContent />
                    </div>
                </main>
            </div>
        </>
    );
}
