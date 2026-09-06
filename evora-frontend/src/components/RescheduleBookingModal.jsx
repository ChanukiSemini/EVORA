// ============================================
// src/components/RescheduleBookingModal.jsx
// EVORA - Premium Reschedule Charging Session Modal
// Interactive date chips, time slot grid, schedule comparison & EVORA design system
// ============================================

import { useState } from 'react';

/* ---------- SVG Icons ---------- */
const IconCalendarClock = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="17" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3 9h18" stroke="currentColor" strokeWidth="1.8" />
        <path d="M7 2v4M17 2v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="15" r="3.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 13.5V15l1 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconCheck = () => (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
        <path d="M16.7 5.3 7.5 14.5 3.3 10.3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconArrowRight = () => (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
        <path d="M4 10H16M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/* ---------- Mock Dates & Time Slots ---------- */
const AVAILABLE_DATES = [
    { id: 'd1', day: 'Sat', date: 'Oct 24', fullDate: 'Oct 24, 2026' },
    { id: 'd2', day: 'Sun', date: 'Oct 25', fullDate: 'Oct 25, 2026' },
    { id: 'd3', day: 'Mon', date: 'Oct 26', fullDate: 'Oct 26, 2026' },
    { id: 'd4', day: 'Tue', date: 'Oct 27', fullDate: 'Oct 27, 2026' },
    { id: 'd5', day: 'Wed', date: 'Oct 28', fullDate: 'Oct 28, 2026' },
];

const AVAILABLE_SLOTS = [
    { time: '08:30 AM', available: true },
    { time: '10:00 AM', available: false }, // occupied
    { time: '11:30 AM', available: true },
    { time: '01:15 PM', available: true },
    { time: '03:00 PM', available: true },
    { time: '04:45 PM', available: true },
    { time: '06:30 PM', available: false }, // occupied
    { time: '08:00 PM', available: true },
];

const RescheduleBookingModal = ({ booking, onClose, onConfirmReschedule }) => {
    const currentBooking = booking || {
        id: '212456',
        station: 'Keels Kaduwela Bay 01',
        date: 'Oct 24, 2026',
        time: '10:30 AM',
    };

    const [selectedDateObj, setSelectedDateObj] = useState(AVAILABLE_DATES[2]); // Oct 26
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('01:15 PM');

    const handleConfirm = () => {
        if (onConfirmReschedule) {
            onConfirmReschedule(currentBooking.id, selectedDateObj.fullDate, selectedTimeSlot);
        }
        if (onClose) onClose();
    };

    return (
        <div className="bc-modal-backdrop reschedule-modal-backdrop" onClick={onClose}>
            <div className="reschedule-modal-card" onClick={(e) => e.stopPropagation()}>
                
                {/* Close Button */}
                <button className="reschedule-close-btn" onClick={onClose} aria-label="Close modal">✕</button>

                {/* Header Icon & Title */}
                <div className="reschedule-header">
                    <div className="reschedule-icon-circle">
                        <IconCalendarClock />
                    </div>
                    <div>
                        <h2 className="reschedule-title">Reschedule Session</h2>
                        <p className="reschedule-subtitle">
                            Booking ID <span className="reschedule-id">#{currentBooking.id}</span> · {currentBooking.station}
                        </p>
                    </div>
                </div>

                {/* Section 1: Select Date Chips */}
                <div className="reschedule-section">
                    <span className="reschedule-section-title">SELECT NEW DATE</span>
                    <div className="reschedule-dates-row">
                        {AVAILABLE_DATES.map((d) => {
                            const isSelected = selectedDateObj.id === d.id;
                            return (
                                <button
                                    key={d.id}
                                    className={`reschedule-date-chip ${isSelected ? 'active' : ''}`}
                                    onClick={() => setSelectedDateObj(d)}
                                >
                                    <span className="reschedule-chip-day">{d.day}</span>
                                    <span className="reschedule-chip-date">{d.date}</span>
                                    {isSelected && <span className="reschedule-chip-check"><IconCheck /></span>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Section 2: Select Time Slot Grid */}
                <div className="reschedule-section">
                    <span className="reschedule-section-title">SELECT TIME SLOT</span>
                    <div className="reschedule-slots-grid">
                        {AVAILABLE_SLOTS.map((s, idx) => {
                            const isSelected = selectedTimeSlot === s.time;
                            return (
                                <button
                                    key={idx}
                                    className={`reschedule-slot-pill ${isSelected ? 'active' : ''} ${!s.available ? 'occupied' : ''}`}
                                    onClick={() => s.available && setSelectedTimeSlot(s.time)}
                                    disabled={!s.available}
                                >
                                    <span className="reschedule-slot-time">{s.time}</span>
                                    {!s.available && <span className="reschedule-slot-busy">Booked</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Section 3: Schedule Comparison Summary */}
                <div className="reschedule-comparison-box">
                    <div className="reschedule-comp-col">
                        <span className="reschedule-comp-label">Current Time</span>
                        <span className="reschedule-comp-val old">{currentBooking.date} · {currentBooking.time}</span>
                    </div>

                    <span className="reschedule-comp-arrow"><IconArrowRight /></span>

                    <div className="reschedule-comp-col">
                        <span className="reschedule-comp-label">New Scheduled Time</span>
                        <span className="reschedule-comp-val new">{selectedDateObj.fullDate} · {selectedTimeSlot}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="reschedule-actions-row">
                    <button className="reschedule-btn-secondary" onClick={onClose}>
                        Keep Current
                    </button>
                    <button className="reschedule-btn-primary" onClick={handleConfirm}>
                        Confirm Reschedule
                    </button>
                </div>

            </div>
        </div>
    );
};

export default RescheduleBookingModal;
