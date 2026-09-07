const Booking = require('../models/Booking');
const Station = require('../models/StationModel');
const { sendResponse, ApiError, asyncHandler } = require('../utils/helper');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public / Driver
const createBooking = asyncHandler(async (req, res) => {
  const {
    stationId,
    stationSlug,
    stationName,
    stationAddress,
    connectorType,
    slot,
    date,
    durationMinutes,
    estimatedTotalcost,
    driverId,
    vehicleId,
  } = req.body;

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

  // Generate 6-digit booking number
  const bookingNumber = Math.floor(100000 + Math.random() * 900000).toString();

  const newBooking = await Booking.create({
    bookingNumber,
    driver: driverId || req.user?._id || undefined,
    vehicle: vehicleId || undefined,
    station: stationRef || undefined,
    stationSlug: stationSlug || resolvedStation?.slug || '',
    stationName: stationName || resolvedStation?.name || 'EVORA Charging Station',
    stationAddress: stationAddress || resolvedStation?.address || 'Colombo, Sri Lanka',
    connectorType: connectorType || 'CCS2 (DC Fast)',
    slot: slot || '12:00 PM',
    date: date ? new Date(date) : new Date(),
    durationMinutes: Number(durationMinutes) || 60,
    estimatedTotalcost: estimatedTotalcost ? String(estimatedTotalcost) : '2,450',
    status: 'confirmed',
    canModify: 'true',
  });

  return sendResponse(res, 201, newBooking, { message: 'Booking created successfully' });
});

// @desc    Get all bookings (For Admin Dashboard & Management)
// @route   GET /api/bookings
// @access  Public / Admin
const getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({})
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
  getBookings,
  getBookingById,
  cancelBooking,
};
