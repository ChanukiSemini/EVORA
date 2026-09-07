// ============================================
// src/components/RescheduleBookingModal.jsx
// EVORA - Premium Reschedule Charging Session Modal
// Interactive date chips, time slot grid, schedule comparison & EVORA design system
// ============================================

import { useMemo, useState, useEffect } from 'react';
import { generateBookingDays, ALL_HOURLY_SLOTS, computeSlotStatus } from '../utils/bookingHelpers';

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

const RescheduleBookingModal = ({ booking, onClose, onConfirmReschedule }) => {
    const currentBooking = booking || {
        id: '212456',
        station: 'Keels Kaduwela Bay 01',
        date: 'Today',
        time: '12:00 PM',
    };

    const dates = useMemo(() => generateBookingDays(0, 6), []);
    const [selectedDateIdx, setSelectedDateIdx] = useState(1); // Default to tomorrow or first available
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

    const activeDateObj = dates[selectedDateIdx] || dates[0];

    const slots = useMemo(() => {
        return ALL_HOURLY_SLOTS.map((slot) => {
            const statusInfo = computeSlotStatus({
                slotHour: slot.hour,
                slotTime: slot.time,
                selectedDate: activeDateObj?.date,
            });
            return {
                ...slot,
                ...statusInfo,
            };
        });
    }, [activeDateObj?.date]);

    // Auto-select valid slot
    useEffect(() => {
        const currentSlotValid = slots.find((s) => s.time === selectedTimeSlot && !s.disabled);
        if (!currentSlotValid) {
            const firstAvailable = slots.find((s) => !s.disabled);
            if (firstAvailable) setSelectedTimeSlot(firstAvailable.time);
        }
    }, [slots, selectedTimeSlot]);

    const handleConfirm = () => {
        if (onConfirmReschedule) {
            const formattedDate = `${activeDateObj.month} ${activeDateObj.num}, ${activeDateObj.year}`;
            onConfirmReschedule(currentBooking.id, formattedDate, selectedTimeSlot);
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
                        {dates.map((d, i) => {
                            const isSelected = selectedDateIdx === i;
                            return (
                                <button
                                    key={d.isoDate}
                                    className={`reschedule-date-chip ${isSelected ? 'active' : ''}`}
                                    onClick={() => setSelectedDateIdx(i)}
                                >
                                    <span className="reschedule-chip-day">{d.day}</span>
                                    <span className="reschedule-chip-date">{d.shortMonth} {d.num}</span>
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
                        {slots.map((s) => {
                            const isSelected = selectedTimeSlot === s.time && !s.disabled;
                            return (
                                <button
                                    key={s.time}
                                    className={`reschedule-slot-pill ${isSelected ? 'active' : ''} ${s.status === 'booked' ? 'occupied' : ''} ${s.disabled ? 'disabled' : ''}`}
                                    onClick={() => !s.disabled && setSelectedTimeSlot(s.time)}
                                    disabled={s.disabled}
                                    title={s.status === 'past' ? 'Past time' : s.status === 'booked' ? 'Already booked' : 'Available'}
                                >
                                    <span className="reschedule-slot-time">{s.time}</span>
                                    {s.status === 'booked' && <span className="reschedule-slot-busy">Booked</span>}
                                    {s.status === 'past' && <span className="reschedule-slot-busy" style={{ background: '#475569', color: '#cbd5e1' }}>Past</span>}
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
                        <span className="reschedule-comp-val new">{activeDateObj.shortMonth} {activeDateObj.num}, {activeDateObj.year} · {selectedTimeSlot || 'Select time'}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="reschedule-actions-row">
                    <button className="reschedule-btn-secondary" onClick={onClose}>
                        Keep Current
                    </button>
                    <button className="reschedule-btn-primary" onClick={handleConfirm} disabled={!selectedTimeSlot}>
                        Confirm Reschedule
                    </button>
                </div>

            </div>
        </div>
    );
};

export default RescheduleBookingModal;
