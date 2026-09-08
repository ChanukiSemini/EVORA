// ============================================
// src/components/CancelBookingModal.jsx
// EVORA - Cancel Booking Pop-up Modal
// Matches Figma design reference precisely with responsive overlay
// ============================================

const CancelBookingModal = ({ booking, onClose, onConfirmCancel }) => {
    const currentBooking = booking || {};

    const displayId = String(currentBooking.bookingNumber || currentBooking._id || currentBooking.id || '');
    const displayStation = (typeof currentBooking.station === 'object' ? currentBooking.station?.name : currentBooking.station) || currentBooking.stationName || currentBooking.charger?.station?.name || currentBooking.location || 'Charging Station';
    const displayDate = String(currentBooking.date || '');
    const displayTime = (typeof currentBooking.time === 'string' ? currentBooking.time : (typeof currentBooking.slot === 'string' ? currentBooking.slot : (currentBooking.timeSlot || '')));

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
                        <span className="cancel-summary-id">#{displayId}</span>
                    </div>

                    <div className="cancel-summary-group">
                        <span className="cancel-summary-label">Location</span>
                        <span className="cancel-summary-val">{String(displayStation || 'Charging Station')}</span>
                    </div>

                    <div className="cancel-summary-group">
                        <span className="cancel-summary-label">Time Slot</span>
                        <span className="cancel-summary-val">
                            {displayDate} {displayTime ? `· ${displayTime}` : ''}
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
                        type="button"
                        className="cancel-btn-keep"
                        onClick={onClose}
                    >
                        Keep Booking
                    </button>

                    <button
                        type="button"
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
