const Booking = require('../models/Booking');
const Station = require('../models/StationModel');
const { sendResponse, ApiError, asyncHandler } = require('../utils/helper');

// Helper to get start and end of day in both UTC and local timezone bounds
const getDayRange = (dateInput) => {
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    const [y, m, d] = dateInput.split('-').map(Number);
    // Covering UTC day and +/- 14hr timezone variance
    const startOfDay = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999));
    return { startOfDay, endOfDay };
  }
  const d = new Date(dateInput);
  const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
  return { startOfDay, endOfDay };
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public / Driver
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
  let stationRef = null;
  let resolvedStation = null;

  if (stationId && stationId.match(/^[0-9a-fA-F]{24}$/)) {
    stationRef = stationId;
    resolvedStation = await Station.findById(stationId);
  } else if (stationSlug) {
    resolvedStation = await Station.findOne({ slug: stationSlug });
    if (resolvedStation) {
      stationRef = resolvedStation._id;
    }
  }

  const effectiveSlug = stationSlug || resolvedStation?.slug || '';
  const effectiveBayId = bayId || 'bay-1';
  const effectiveDate = date ? new Date(date) : new Date();
  const { startOfDay, endOfDay } = getDayRange(date || effectiveDate);

  // Check if this slot is already booked for this station and bay on the requested date
  const stationMatchConditions = [];
  if (effectiveSlug) {
    stationMatchConditions.push({ stationSlug: effectiveSlug });
  }
  if (stationRef) {
    stationMatchConditions.push({ station: stationRef });
  }
  if (resolvedStation?.name || stationName) {
    stationMatchConditions.push({ stationName: resolvedStation?.name || stationName });
  }

  const existingBooking = await Booking.findOne({
    status: { $in: ['confirmed', 'completed', 'pending'] },
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
          { connectorType: new RegExp(bayName || 'Bay 1', 'i') }
        ]
      }
    ]
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

// @desc    Get booked slots / availability for a station and bay on a given date
// @route   GET /api/bookings/availability
// @access  Public
const getAvailability = asyncHandler(async (req, res) => {
  const { stationSlug, stationId, stationName, bayId, date } = req.query;

  const targetDate = date ? (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : new Date(date)) : new Date();
  const { startOfDay, endOfDay } = getDayRange(targetDate);

  const filter = {
    status: { $in: ['confirmed', 'completed', 'pending'] },
    date: { $gte: startOfDay, $lte: endOfDay },
  };

  const stationQueries = [];
  if (stationSlug) stationQueries.push({ stationSlug });
  if (stationId && stationId.match(/^[0-9a-fA-F]{24}$/)) stationQueries.push({ station: stationId });
  if (stationName) stationQueries.push({ stationName });

  if (stationQueries.length > 0) {
    filter.$or = stationQueries;
  }

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
          { connectorType: new RegExp(`Bay\\s*${bayNum}`, 'i') }
        ]
      }
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

// @desc    Get all bookings (For Admin Dashboard & Management / User filtering)
// @route   GET /api/bookings
// @access  Public / Admin
const getBookings = asyncHandler(async (req, res) => {
  const { stationSlug, stationId, bayId, date, status, driverId } = req.query;
  const filter = {};

  if (driverId) {
    filter.driver = driverId;
  }

  if (status) {
    filter.status = status;
  }

  if (stationId && stationId.match(/^[0-9a-fA-F]{24}$/)) {
    filter.$or = [{ station: stationId }, { stationSlug: stationSlug || undefined }].filter(Boolean);
  } else if (stationSlug) {
    filter.stationSlug = stationSlug;
  }

  if (bayId) {
    filter.bayId = bayId;
  }

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

// @desc    Get single booking by ID or Booking Number
// @route   GET /api/bookings/:id
// @access  Public / Driver
const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let booking = null;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    booking = await Booking.findById(id).populate('station').populate('driver');
  }
  if (!booking) {
    booking = await Booking.findOne({ bookingNumber: id }).populate('station').populate('driver');
  }

  if (!booking) {
    throw new ApiError(404, `Booking not found for ID '${id}'`);
  }

  return sendResponse(res, 200, booking);
});

// @desc    Cancel a booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Public / Driver / Admin
const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let booking = await Booking.findOne({
    $or: [
      { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
      { bookingNumber: id }
    ],
  });

  if (!booking) {
    throw new ApiError(404, `Booking not found for ID '${id}'`);
  }

  booking.status = 'cancelled';
  booking.cancelledDate = new Date();
  booking.cancelleddate = new Date().toISOString();
  booking.canModify = 'false';

  await booking.save();

  return sendResponse(res, 200, booking, { message: 'Booking cancelled successfully' });
});

module.exports = {
  createBooking,
  getAvailability,
  getBookings,
  getBookingById,
  cancelBooking,
};
