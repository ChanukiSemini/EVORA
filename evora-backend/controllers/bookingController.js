// controllers/bookingController.js
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Station = require('../models/Station');
const { sendResponse, ApiError, asyncHandler } = require('../utils/helper');

// Require models so Mongoose registers them
try { require('../models/TimeSlot'); } catch (_) {}
try { require('../models/Connector'); } catch (_) {}
try { require('../models/StationModel'); } catch (_) {}
try { require('../models/Charger'); } catch (_) {}
try { require('../models/Vehicle'); } catch (_) {}
try { require('../models/EvDriver'); } catch (_) {}

function getStationModel() {
    try { return require('../models/StationModel'); } catch (_) { return null; }
}

/**
 * Combines booking date + slot string into a real Date object.
 */
function getBookingDateTime(booking) {
    let baseDate;
    if (booking.date instanceof Date) {
        baseDate = new Date(booking.date);
    } else if (booking.date) {
        baseDate = new Date(booking.date);
    } else {
        baseDate = new Date();
    }

    const timeStr = (booking.slot && typeof booking.slot === 'string')
        ? booking.slot
        : (booking.time || booking.timeSlot || (typeof booking.slot?.time === 'string' ? booking.slot.time : ''));

    if (timeStr) {
        const match = timeStr.match(/^(\d{1,2}):(\d{2})(?:\s*([ap]m))?$/i);
        if (match) {
            let hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);
            const ampm = match[3] ? match[3].toLowerCase() : null;
            if (ampm === 'pm' && hours < 12) hours += 12;
            if (ampm === 'am' && hours === 12) hours = 0;
            baseDate.setHours(hours, minutes, 0, 0);
            return baseDate;
        }
    }
    return baseDate;
}

/**
 * Resolves real-time booking status:
 * - 'cancelled' if status === 'cancelled'
 * - 'completed' if date + slot in past
 * - 'upcoming' if date + slot in future
 */
function resolveBookingStatus(booking) {
    if (booking.status === 'cancelled') return 'cancelled';
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

/**
 * POST /api/bookings
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

    const StationModelRef = getStationModel();
    let stationRef = null;
    let resolvedStation = null;

    if (stationId && mongoose.Types.ObjectId.isValid(stationId)) {
        stationRef = stationId;
        resolvedStation = (await Station.findById(stationId)) || (StationModelRef ? await StationModelRef.findById(stationId) : null);
    } else if (stationSlug) {
        resolvedStation = (await Station.findOne({ slug: stationSlug })) || (StationModelRef ? await StationModelRef.findOne({ slug: stationSlug }) : null);
        if (resolvedStation) {
            stationRef = resolvedStation._id;
        }
    }

    const effectiveSlug = stationSlug || resolvedStation?.slug || '';
    const effectiveBayId = bayId || 'bay-1';
    const effectiveDate = date ? new Date(date) : new Date();
    const { startOfDay, endOfDay } = getDayRange(date || effectiveDate);

    const stationMatchConditions = [];
    if (effectiveSlug) stationMatchConditions.push({ stationSlug: effectiveSlug });
    if (stationRef) stationMatchConditions.push({ station: String(stationRef) });
    if (resolvedStation?.name || stationName) {
        stationMatchConditions.push({ stationName: resolvedStation?.name || stationName });
    }

    const existingBooking = await Booking.findOne({
        status: { $in: ['confirmed', 'upcoming', 'completed', 'pending'] },
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

    const bookingNumber = Math.floor(100000 + Math.random() * 900000).toString();

    const newBooking = await Booking.create({
        bookingNumber,
        driver: driverId ? String(driverId) : (req.user?._id ? String(req.user._id) : undefined),
        vehicle: vehicleId ? String(vehicleId) : undefined,
        station: stationRef ? String(stationRef) : (stationId ? String(stationId) : undefined),
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
 */
const getAvailability = asyncHandler(async (req, res) => {
    const { stationSlug, stationId, stationName, bayId, date } = req.query;

    const targetDate = date
        ? (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : new Date(date))
        : new Date();
    const { startOfDay, endOfDay } = getDayRange(targetDate);

    const filter = {
        status: { $in: ['confirmed', 'upcoming', 'completed', 'pending'] },
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
        .sort({ createdAt: -1 });

    return sendResponse(res, 200, bookings);
});

/**
 * GET /api/bookings/driver/:driverId?status=all|upcoming|completed|cancelled
 */
async function getDriverBookings(req, res) {
    try {
        const { driverId } = req.params;
        const { status = 'all' } = req.query;

        const driverFilter = [
            driverId,
            mongoose.Types.ObjectId.isValid(driverId) ? new mongoose.Types.ObjectId(driverId) : null,
        ].filter(Boolean);

        const bookings = await Booking.find({
            $or: [
                { driver: driverId },
                { driver: { $in: driverFilter } }
            ]
        }).sort({ date: -1, createdAt: -1 });

        const now = new Date();
        const oneHourMs = 60 * 60 * 1000;

        // Fetch station info for bookings where station ID is valid
        const stationIds = bookings
            .map(b => b.station)
            .filter(s => s && mongoose.Types.ObjectId.isValid(s));
        
        const stations = await Station.find({ _id: { $in: stationIds } }).lean();
        const stationMap = new Map(stations.map(s => [s._id.toString(), s]));

        const enriched = bookings.map((booking) => {
            const rawObj = booking.toObject();
            const resolvedStatus = resolveBookingStatus(booking);
            const bookingTime = getBookingDateTime(booking);
            const msUntilBooking = bookingTime.getTime() - now.getTime();

            const st = (rawObj.station && stationMap.get(rawObj.station.toString())) || null;

            const displayTime =
                (typeof rawObj.slot === 'string' ? rawObj.slot : null) ||
                rawObj.time || rawObj.timeSlot || rawObj.slot?.time || '';
            const displayCost = rawObj.estimatedTotalcost || rawObj.estimatedTotalCost || '';
            const displayCancelledDate = rawObj.cancelleddate || rawObj.cancelledDate || '';

            return {
                ...rawObj,
                station: st || rawObj.station,
                stationName: rawObj.stationName || st?.name || '',
                stationAddress: rawObj.stationAddress || st?.address || '',
                date: formatDateDisplay(rawObj.date),
                rawDate: rawObj.date,
                time: displayTime,
                estimatedTotalCost: displayCost,
                cancelledDate: displayCancelledDate ? formatDateDisplay(displayCancelledDate) : '',
                resolvedStatus,
                canReschedule: resolvedStatus === 'upcoming' && msUntilBooking > oneHourMs,
            };
        });

        const filtered = status === 'all'
            ? enriched
            : enriched.filter((b) => b.resolvedStatus === status);

        return res.status(200).json(filtered);
    } catch (error) {
        console.error('getDriverBookings error:', error);
        return res.status(400).json({ message: error.message });
    }
}

/**
 * GET /api/bookings/:id
 */
const getBookingById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    let booking = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        booking = await Booking.findById(id);
    }
    if (!booking) {
        booking = await Booking.findOne({ bookingNumber: id });
    }

    if (!booking) {
        throw new ApiError(404, `Booking not found for ID '${id}'`);
    }

    let station = null;
    if (booking.station) {
        if (mongoose.Types.ObjectId.isValid(booking.station)) {
            station = await Station.findById(booking.station);
        }
        if (!station && typeof booking.station === 'string') {
            station = await Station.findOne({ slug: booking.station });
        }
    }
    if (!station && booking.stationSlug) {
        station = await Station.findOne({ slug: booking.stationSlug });
    }

    const rawObj = booking.toObject();
    const displayTime =
        (typeof rawObj.slot === 'string' ? rawObj.slot : null) ||
        rawObj.time || rawObj.timeSlot || rawObj.slot?.time || '';
    const displayCost = rawObj.estimatedTotalcost || rawObj.estimatedTotalCost || '';

    return res.status(200).json({
        ...rawObj,
        station: station || rawObj.station,
        date: formatDateDisplay(rawObj.date),
        time: displayTime,
        estimatedTotalCost: displayCost,
    });
});

/**
 * PATCH /api/bookings/:id/cancel
 */
const cancelBooking = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const now = new Date();

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

    return res.status(200).json(booking);
});

module.exports = {
    createBooking,
    getAvailability,
    getBookings,
    getBookingById,
    getDriverBookings,
    cancelBooking,
};
