// routes/bookingRoutes.js
//
// Merged from two feature branches:
//   - feature-EditInfo    : /driver/:driverId, /review/:id, /:id/cancel
//   - Feature-BookCharger : POST /, /availability, GET /, /:id, /:id/cancel
//
// Route ordering matters — more-specific paths must be declared before /:id
// so Express does not try to cast literal strings as MongoDB ObjectIds.

const express = require('express');
const router = express.Router();

const {
    createBooking,
    getAvailability,
    getBookings,
    getBookingById,
    getDriverBookings,
    getBookingForReview,
    cancelBooking,
} = require('../controllers/bookingController');

// ── Feature-BookCharger endpoints ─────────────────────────────────────────────

// POST /api/bookings — create a new booking
router.post('/', createBooking);

// GET /api/bookings/availability?stationSlug=&bayId=&date= — live slot availability
router.get('/availability', getAvailability);

// ── feature-EditInfo endpoints ────────────────────────────────────────────────

// GET /api/bookings/driver/:driverId?status=all|upcoming|completed|cancelled
// My Reservations list — must be before /:id to avoid ObjectId cast errors
router.get('/driver/:driverId', getDriverBookings);

// ── Shared / Admin endpoints ──────────────────────────────────────────────────

// GET /api/bookings — all bookings (admin / filtered by query params)
router.get('/', getBookings);

// GET /api/bookings/review/:id — single booking with full charger/station populate
// Dedicated endpoint for the Review page
router.get('/review/:id', getBookingForReview);

// PATCH /api/bookings/:id/cancel — cancel by _id or booking number
router.patch('/:id/cancel', cancelBooking);

// GET /api/bookings/:id — single booking by _id or booking number
// Must be last among GET /:id routes
router.get('/:id', getBookingById);

module.exports = router;