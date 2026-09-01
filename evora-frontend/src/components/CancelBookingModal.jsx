// ============================================
// src/components/CancelBookingModal.jsx
// EVORA - Cancel Booking Pop-up Modal
// Matches Figma design reference precisely with responsive overlay
// ============================================

import React from 'react';

const CancelBookingModal = ({ booking, onClose, onConfirmCancel }) => {
    // Default fallback mock if opened without specific props
    const currentBooking = booking || {
        id: '212457',
        station: 'Softlogic Glomark - Delkanda',
        date: 'Oct 26, 2026',
        time: '02:15 PM',
    };

    return (
        <div className="bc-modal-backdrop cancel-modal-backdrop" onClick={onClose}>
            <div className="cancel-modal-card" onClick={(e) => e.stopPropagation()}>
                
                {/* Red Exclamation Circle Icon */}
                <div className="cancel-icon-circle">
                    <span className="cancel-exclamation-mark">!</span>
                </div>

                {/* Title */}
                <h2 className="cancel-modal-title">Cancel Booking?</h2>

                {/* Inner Summary Box */}
                <div className="cancel-summary-box">
                    <div className="cancel-summary-row id-row">
                        <span className="cancel-summary-label">BOOKING ID</span>
                        <span className="cancel-summary-id">#{currentBooking.id}</span>
                    </div>

                    <div className="cancel-summary-group">
                        <span className="cancel-summary-label">Location</span>
                        <span className="cancel-summary-val">{currentBooking.station || currentBooking.location}</span>
                    </div>

                    <div className="cancel-summary-group">
                        <span className="cancel-summary-label">Time Slot</span>
                        <span className="cancel-summary-val">
                            {currentBooking.date} · {currentBooking.time}
                        </span>
                    </div>
                </div>

                {/* Warning Subtitle */}
                <p className="cancel-modal-warning">
                    This action cannot be undone. Your booking slot will be released.
                </p>

                {/* Action Buttons */}
                <div className="cancel-modal-actions">
                    <button
                        className="cancel-btn-keep"
                        onClick={onClose}
                    >
                        Keep Booking
                    </button>

                    <button
                        className="cancel-btn-confirm"
                        onClick={onConfirmCancel}
                    >
                        Yes, Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelBookingModal;
