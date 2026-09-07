// controllers/bookingController.js
//
// Purpose: handles fetching booking data for:
//   (1) the Review page — single booking with full populate
//   (2) the My Reservations page — all bookings for a driver,
//       with real-time status resolution and reschedule eligibility

const mongoose = require('mongoose');
const Booking = require('../models/Booking');
require('../models/TimeSlot');
require('../models/Connector');
require('../models/Station');
require('../models/Charger');
require('../models/Vehicle');
require('../models/EvDriver');

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Combines a booking's date + time fields into a single JS Date object so we
 * can compare it against the current time.
 */
function getBookingDateTime(booking) {
    if (booking.date instanceof Date) {
        const d = new Date(booking.date);
        const timeStr = booking.time || booking.timeSlot || booking.slot?.time;
        if (timeStr) {
            const match = timeStr.match(/^(\d{1,2}):(\d{2})(?:\s*([ap]m))?$/i);
            if (match) {
                let hours = parseInt(match[1], 10);
                const minutes = parseInt(match[2], 10);
                const ampm = match[3]?.toLowerCase();
                if (ampm === 'pm' && hours < 12) hours += 12;
                if (ampm === 'am' && hours === 12) hours = 0;
                d.setHours(hours, minutes, 0, 0);
                return d;
            }
        }
        return d;
    }

    const rawTime = booking.time || booking.timeSlot || booking.slot?.time || '00:00';
    const rawDate = booking.date || '';

    // Try ISO-style "HH:MM" first (e.g. "14:30")
    const isoAttempt = new Date(`${rawDate}T${rawTime}`);
    if (!isNaN(isoAttempt.getTime())) return isoAttempt;

    // Fall back to 12-hr format (e.g. "2:30 PM") — combine with date string
    const fallback = new Date(`${rawDate} ${rawTime}`);
    if (!isNaN(fallback.getTime())) return fallback;

    const directDate = new Date(rawDate);
    if (!isNaN(directDate.getTime())) return directDate;

    // Last resort: return epoch
    return new Date(0);
}

/**
 * Determines the real-time resolved status of a booking:
 *  - 'cancelled'  → always cancelled
 *  - 'completed'  → already completed in DB or booking time is in the past
 *  - 'upcoming'   → booking time is still in the future
 */
function resolveBookingStatus(booking) {
    if (booking.status === 'cancelled') return 'cancelled';
    if (booking.status === 'completed') return 'completed';

    const bookingTime = getBookingDateTime(booking);
    const now = new Date();

    return bookingTime < now ? 'completed' : 'upcoming';
}

function formatDateDisplay(rawDate) {
    if (!rawDate) return '';
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return String(rawDate);
}

// ─────────────────────────────────────────────────────────────────────────────
// Controllers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/bookings/driver/:driverId?status=all|upcoming|completed|cancelled
 *
 * Returns all bookings for a driver, enriched with:
 *   - resolvedStatus  — real-time status (ignores stale stored status)
 *   - canReschedule   — true only for upcoming bookings > 1 hour away
 *
 * The ?status query param filters the result set. Defaults to 'all'.
 */
async function getDriverBookings(req, res) {
    try {
        const { driverId } = req.params;
        const { status = 'all' } = req.query;

        const driverIdStr = String(driverId);
        const driverFilter = [
            driverIdStr,
            mongoose.Types.ObjectId.isValid(driverIdStr) ? new mongoose.Types.ObjectId(driverIdStr) : null,
        ].filter(Boolean);

        const bookings = await Booking.find({ driver: { $in: driverFilter } })
            .populate({
                path: 'charger',
                populate: [
                    { path: 'station' },    // gives station name/address
                    { path: 'connector' },  // gives connector label/spec
                ],
            })
            .populate('slot')
            .populate('vehicle')
            .sort({ createdAt: -1, date: -1 });

        const oneHourMs = 60 * 60 * 1000;

        // Attach computed fields without mutating the database documents
        const enriched = bookings.map((booking) => {
            const rawObj = booking.toObject();
            const resolvedStatus = resolveBookingStatus(booking);
            const bookingTime = getBookingDateTime(booking);
            const now = new Date();
            const msUntilBooking = bookingTime - now;

            const displayTime = rawObj.time || rawObj.timeSlot || rawObj.slot?.time || '';
            const displayCost = rawObj.estimatedTotalcost || rawObj.estimatedTotalCost || '';
            const displayCancelledDate = rawObj.cancelleddate || rawObj.cancelledDate || '';

            return {
                ...rawObj,
                date: formatDateDisplay(rawObj.date),
                time: displayTime,
                estimatedTotalCost: displayCost,
                cancelledDate: displayCancelledDate ? formatDateDisplay(displayCancelledDate) : '',
                resolvedStatus,
                // Reschedule is only allowed for upcoming bookings with > 1 hr to go
                canReschedule: resolvedStatus === 'upcoming' && msUntilBooking > oneHourMs,
            };
        });

        const filtered =
            status === 'all'
                ? enriched
                : enriched.filter((b) => b.resolvedStatus === status);

        res.status(200).json(filtered);
    } catch (error) {
        console.error('getDriverBookings error:', error);
        res.status(400).json({ message: error.message });
    }
}

/**
 * GET /api/bookings/:id
 *
 * Returns a single booking with everything the Review page needs —
 * station details come via the charger reference (charger → station).
 */
async function getBookingForReview(req, res) {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate({
                path: 'charger',
                populate: [
                    { path: 'station' },   // gives us station name/address
                    { path: 'connector' }, // gives us connector name/spec
                ],
            })
            .populate('slot')
            .populate('vehicle')
            .populate('driver');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const rawObj = booking.toObject();
        const displayTime = rawObj.time || rawObj.timeSlot || rawObj.slot?.time || '';
        const displayCost = rawObj.estimatedTotalcost || rawObj.estimatedTotalCost || '';

        res.status(200).json({
            ...rawObj,
            date: formatDateDisplay(rawObj.date),
            time: displayTime,
            estimatedTotalCost: displayCost,
        });
    } catch (error) {
        console.error('getBookingForReview error:', error);
        res.status(400).json({ message: error.message });
    }
}

/**
 * PATCH /api/bookings/:id/cancel
 * Marks a booking as cancelled in MongoDB.
 */
async function cancelBooking(req, res) {
    try {
        const now = new Date();
        const cancelledBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            {
                status: 'cancelled',
                cancelledDate: now.toISOString(),
                cancelleddate: now.toISOString(),
            },
            { new: true }
        );

        if (!cancelledBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json(cancelledBooking);
    } catch (error) {
        console.error('cancelBooking error:', error);
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getDriverBookings,
    getBookingForReview,
    cancelBooking
};