// controllers/bookingController.js
//
// Merged from two feature branches:
//   - feature-EditInfo    : getDriverBookings, getBookingForReview, cancelBooking
//   - Feature-BookCharger : createBooking, getAvailability, getBookings,
//                           getBookingById, cancelBooking
//
// All functions are exported so both sets of routes can use this single file.

const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const { sendResponse, ApiError, asyncHandler } = require('../utils/helper');

// Require models so Mongoose registers them for populate() calls
try { require('../models/TimeSlot'); } catch (_) {}
try { require('../models/Connector'); } catch (_) {}
try { require('../models/Station'); } catch (_) {}
try { require('../models/StationModel'); } catch (_) {}
try { require('../models/Charger'); } catch (_) {}
try { require('../models/Vehicle'); } catch (_) {}
try { require('../models/EvDriver'); } catch (_) {}

// Lazy-load StationModel (only needed for createBooking)
function getStationModel() {
    try { return require('../models/StationModel'); } catch (_) { return null; }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers (feature-EditInfo)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Combines a booking's date + time fields into a single JS Date object so we
 * can compare it against the current time.
 * Supports both the new slot string (e.g. "12:00 PM") and legacy time/timeSlot
 * fields.
 */
function getBookingDateTime(booking) {
    if (booking.date instanceof Date) {
        const d = new Date(booking.date);
        // Prefer the primary slot string, fall back to legacy time fields
        const timeStr = booking.slot && typeof booking.slot === 'string'
            ? booking.slot
            : booking.time || booking.timeSlot || booking.slot?.time;
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

    const rawTime = (booking.slot && typeof booking.slot === 'string')
        ? booking.slot
        : booking.time || booking.timeSlot || booking.slot?.time || '00:00';
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
 *
 * Maps 'confirmed' → 'upcoming' so the My Reservations page handles new
 * bookings from Feature-BookCharger correctly.
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
// Helper (Feature-BookCharger)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns {startOfDay, endOfDay} covering the entire calendar day for the
 * given date string or Date object.  Handles both ISO strings (YYYY-MM-DD)
 * and Date objects.
 */
const getDayRange = (dateInput) => {
    if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
        const [y, m, d] = dateInput.split('-').map(Number);
        const startOfDay = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
        const endOfDay = new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999));
        return { startOfDay, endOfDay };
    }
    const d = new Date(dateInput);
    const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
    return { startOfDay, endOfDay };
};

// ─────────────────────────────────────────────────────────────────────────────
// Controllers — Feature-BookCharger
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/bookings
 *
 * Creates a new booking after checking that the requested slot/bay combination
 * is not already taken on that date.
 */
const createBooking = asyncHandler(async (req, res) => {
    const {
        stationId,
        stationSlug,
        stationName,
        stationAddress,
        bayId,
        bayName,
        connectorType,
        slot,
        date,
        durationMinutes,
        estimatedTotalcost,
        driverId,
        vehicleId,
    } = req.body;

    if (!slot) {
        throw new ApiError(400, 'Time slot is required');
    }

    // Resolve station reference if available
    const Station = getStationModel();
    let stationRef = null;
    let resolvedStation = null;

    if (Station) {
        if (stationId && stationId.match(/^[0-9a-fA-F]{24}$/)) {
            stationRef = stationId;
            resolvedStation = await Station.findById(stationId);
        } else if (stationSlug) {
            resolvedStation = await Station.findOne({ slug: stationSlug });
            if (resolvedStation) {
                stationRef = resolvedStation._id;
            }
        }
    }

    const effectiveSlug = stationSlug || resolvedStation?.slug || '';
    const effectiveBayId = bayId || 'bay-1';
    const effectiveDate = date ? new Date(date) : new Date();
    const { startOfDay, endOfDay } = getDayRange(date || effectiveDate);

    // Check if this slot is already booked for this station/bay on the requested date
    const stationMatchConditions = [];
    if (effectiveSlug) stationMatchConditions.push({ stationSlug: effectiveSlug });
    if (stationRef) stationMatchConditions.push({ station: stationRef });
    if (resolvedStation?.name || stationName) {
        stationMatchConditions.push({ stationName: resolvedStation?.name || stationName });
    }

    const existingBooking = await Booking.findOne({
        status: { $in: ['confirmed', 'upcoming', 'pending'] },
        date: { $gte: startOfDay, $lte: endOfDay },
        slot: slot.trim(),
        $and: [
            { $or: stationMatchConditions.length > 0 ? stationMatchConditions : [{}] },
            {
                $or: [
                    { bayId: effectiveBayId },
                    { bayId: '' },
                    { bayId: null },
                    { bayName: bayName || 'Bay 1' },
                    { connectorType: new RegExp(bayName || 'Bay 1', 'i') },
                ],
            },
        ],
    });

    if (existingBooking) {
        throw new ApiError(
            409,
            `The time slot '${slot}' on ${effectiveDate.toDateString()} is already booked for ${bayName || effectiveBayId}. Please select another slot or bay.`
        );
    }

    // Generate 6-digit booking number
    const bookingNumber = Math.floor(100000 + Math.random() * 900000).toString();

    const newBooking = await Booking.create({
        bookingNumber,
        driver: driverId || req.user?._id || undefined,
        vehicle: vehicleId || undefined,
        station: stationRef || undefined,
        stationSlug: effectiveSlug,
        stationName: stationName || resolvedStation?.name || 'EVORA Charging Station',
        stationAddress: stationAddress || resolvedStation?.address || 'Colombo, Sri Lanka',
        bayId: effectiveBayId,
        bayName: bayName || 'Bay 1',
        connectorType: connectorType || 'CCS2 (DC Fast)',
        slot: slot.trim(),
        date: effectiveDate,
        durationMinutes: Number(durationMinutes) || 60,
        estimatedTotalcost: estimatedTotalcost ? String(estimatedTotalcost) : '2,450',
        status: 'confirmed',
        canModify: 'true',
    });

    return sendResponse(res, 201, newBooking, { message: 'Booking created successfully' });
});

/**
 * GET /api/bookings/availability
 *
 * Returns booked slots for a station/bay on a given date, used by the
 * BookCharger page to show live slot availability.
 */
const getAvailability = asyncHandler(async (req, res) => {
    const { stationSlug, stationId, stationName, bayId, date } = req.query;

    const targetDate = date
        ? (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : new Date(date))
        : new Date();
    const { startOfDay, endOfDay } = getDayRange(targetDate);

    const filter = {
        status: { $in: ['confirmed', 'upcoming', 'pending'] },
        date: { $gte: startOfDay, $lte: endOfDay },
    };

    const stationQueries = [];
    if (stationSlug) stationQueries.push({ stationSlug });
    if (stationId && stationId.match(/^[0-9a-fA-F]{24}$/)) stationQueries.push({ station: stationId });
    if (stationName) stationQueries.push({ stationName });
    if (stationQueries.length > 0) filter.$or = stationQueries;

    if (bayId) {
        const bayNumMatch = bayId.match(/\d+/);
        const bayNum = bayNumMatch ? bayNumMatch[0] : '1';
        filter.$and = [
            {
                $or: [
                    { bayId: bayId },
                    { bayId: '' },
                    { bayId: null },
                    { bayName: new RegExp(`Bay\\s*${bayNum}`, 'i') },
                    { connectorType: new RegExp(`Bay\\s*${bayNum}`, 'i') },
                ],
            },
        ];
    }

    const bookings = await Booking.find(filter)
        .select('slot date bayId bayName bookingNumber durationMinutes status connectorType')
        .lean();

    const bookedSlots = Array.from(new Set(bookings.map((b) => b.slot)));

    return sendResponse(res, 200, {
        date: typeof date === 'string' ? date : new Date(targetDate).toISOString().split('T')[0],
        bayId: bayId || null,
        stationSlug: stationSlug || null,
        bookedSlots,
        bookings,
    });
});

/**
 * GET /api/bookings
 *
 * Returns all bookings with optional filtering.  Used by the Admin Dashboard
 * and generic booking management.
 */
const getBookings = asyncHandler(async (req, res) => {
    const { stationSlug, stationId, bayId, date, status, driverId } = req.query;
    const filter = {};

    if (driverId) filter.driver = driverId;
    if (status) filter.status = status;

    if (stationId && stationId.match(/^[0-9a-fA-F]{24}$/)) {
        filter.$or = [{ station: stationId }, { stationSlug: stationSlug || undefined }].filter(
            (q) => Object.values(q)[0] !== undefined
        );
    } else if (stationSlug) {
        filter.stationSlug = stationSlug;
    }

    if (bayId) filter.bayId = bayId;

    if (date) {
        const { startOfDay, endOfDay } = getDayRange(date);
        filter.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const bookings = await Booking.find(filter)
        .populate('driver', 'fullName name email phone')
        .populate('station', 'name address slug')
        .sort({ createdAt: -1 });

    return sendResponse(res, 200, bookings);
});

/**
 * GET /api/bookings/:id
 *
 * Returns a single booking by MongoDB _id or booking number.
 * Used by both the Review page (via full populate) and BookCharger.
 */
const getBookingById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    let booking = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        booking = await Booking.findById(id)
            .populate({
                path: 'charger',
                populate: [{ path: 'station' }, { path: 'connector' }],
            })
            .populate('slot')
            .populate('vehicle')
            .populate('driver')
            .populate('station');
    }
    if (!booking) {
        booking = await Booking.findOne({ bookingNumber: id })
            .populate('station')
            .populate('driver');
    }

    if (!booking) {
        throw new ApiError(404, `Booking not found for ID '${id}'`);
    }

    const rawObj = booking.toObject();
    const displayTime =
        (typeof rawObj.slot === 'string' ? rawObj.slot : null) ||
        rawObj.time || rawObj.timeSlot || rawObj.slot?.time || '';
    const displayCost = rawObj.estimatedTotalcost || rawObj.estimatedTotalCost || '';

    return sendResponse(res, 200, {
        ...rawObj,
        date: formatDateDisplay(rawObj.date),
        time: displayTime,
        estimatedTotalCost: displayCost,
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Controllers — feature-EditInfo (My Reservations)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/bookings/driver/:driverId?status=all|upcoming|completed|cancelled
 *
 * Returns all bookings for a driver, enriched with:
 *   - resolvedStatus  — real-time status (ignores stale stored status)
 *   - canReschedule   — true only for upcoming bookings > 1 hour away
 *
 * The ?status query param filters the result set.  Defaults to 'all'.
 */
async function getDriverBookings(req, res) {
    try {
        const { driverId } = req.params;
        const { status = 'all' } = req.query;

        const driverIdStr = String(driverId);
        const driverFilter = [
            driverIdStr,
            mongoose.Types.ObjectId.isValid(driverIdStr)
                ? new mongoose.Types.ObjectId(driverIdStr)
                : null,
        ].filter(Boolean);

        const bookings = await Booking.find({ driver: { $in: driverFilter } })
            .populate({
                path: 'charger',
                populate: [
                    { path: 'station' },   // gives station name/address
                    { path: 'connector' }, // gives connector label/spec
                ],
            })
            .populate('slot')
            .populate('vehicle')
            .populate('station')
            .sort({ createdAt: -1, date: -1 });

        const oneHourMs = 60 * 60 * 1000;

        // Attach computed fields without mutating the database documents
        const enriched = bookings.map((booking) => {
            const rawObj = booking.toObject();
            const resolvedStatus = resolveBookingStatus(booking);
            const bookingTime = getBookingDateTime(booking);
            const now = new Date();
            const msUntilBooking = bookingTime - now;

            // Resolve time string — prefer new slot, fall back to legacy fields
            const displayTime =
                (typeof rawObj.slot === 'string' ? rawObj.slot : null) ||
                rawObj.time || rawObj.timeSlot || rawObj.slot?.time || '';
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
 * GET /api/bookings/review/:id
 *
 * Returns a single booking with everything the Review page needs —
 * station details come via the charger reference (charger → station).
 * Kept as a dedicated endpoint so the Review page doesn't need to change.
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
            .populate('driver')
            .populate('station');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const rawObj = booking.toObject();
        const displayTime =
            (typeof rawObj.slot === 'string' ? rawObj.slot : null) ||
            rawObj.time || rawObj.timeSlot || rawObj.slot?.time || '';
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

// ─────────────────────────────────────────────────────────────────────────────
// Controllers — Shared
// ─────────────────────────────────────────────────────────────────────────────

/**
 * PATCH /api/bookings/:id/cancel
 *
 * Marks a booking as cancelled in MongoDB.  Accepts both MongoDB _id and
 * booking number (for Feature-BookCharger compatibility).
 */
const cancelBooking = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const now = new Date();

    // Find by _id or booking number
    let booking = await Booking.findOne({
        $or: [
            { _id: id.match(/^[0-9a-fA-F]{24}$/) ? new mongoose.Types.ObjectId(id) : null },
            { bookingNumber: id },
        ].filter((q) => Object.values(q)[0] !== null),
    });

    if (!booking) {
        throw new ApiError(404, `Booking not found for ID '${id}'`);
    }

    booking.status = 'cancelled';
    booking.cancelledDate = now;
    booking.cancelleddate = now.toISOString();
    booking.canModify = 'false';

    await booking.save();

    return sendResponse(res, 200, booking, { message: 'Booking cancelled successfully' });
});

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
    // Feature-BookCharger endpoints
    createBooking,
    getAvailability,
    getBookings,
    getBookingById,
    // feature-EditInfo endpoints
    getDriverBookings,
    getBookingForReview,
    // Shared
    cancelBooking,
};