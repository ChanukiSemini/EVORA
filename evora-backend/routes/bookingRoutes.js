const express = require('express');
const router = express.Router();

const {
    createBooking,
    getAvailability,
    getBookings,
    getBookingById,
    getDriverBookings,
    cancelBooking,
} = require('../controllers/bookingController');

// POST /api/bookings — create a new booking
router.post('/', createBooking);

// GET /api/bookings/availability — slot availability
router.get('/availability', getAvailability);

// GET /api/bookings/driver/:driverId — must be declared before /:id
router.get('/driver/:driverId', getDriverBookings);

// GET /api/bookings — all bookings (query filtered)
router.get('/', getBookings);

// PATCH /api/bookings/:id/cancel — cancel booking
router.patch('/:id/cancel', cancelBooking);

// GET /api/bookings/:id — single booking by _id or bookingNumber
router.get('/:id', getBookingById);

module.exports = router;
