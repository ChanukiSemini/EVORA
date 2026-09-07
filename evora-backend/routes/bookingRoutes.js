// routes/bookingRoutes.js
const express = require('express');
const { getBookingForReview, getDriverBookings, cancelBooking } = require('../controllers/bookingController');

const router = express.Router();

// IMPORTANT: /driver/:driverId must be declared before /:id — if the order
// were reversed, Express would try to cast the literal string "driver" as a
// MongoDB ObjectId and throw a CastError.

// GET /api/bookings/driver/:driverId?status=all|upcoming|completed|cancelled
// My Reservations list — returns all bookings for a driver with resolved
// real-time status and reschedule eligibility attached to each record
router.get('/driver/:driverId', getDriverBookings);

// PATCH /api/bookings/:id/cancel — marks a booking as cancelled
router.patch('/:id/cancel', cancelBooking);

// GET /api/bookings/:id — single booking with full populate, used by Review page
router.get('/:id', getBookingForReview);

module.exports = router;