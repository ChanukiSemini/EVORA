const express = require('express');
const router = express.Router();
const {
  createBooking,
  getAvailability,
  getBookings,
  getBookingById,
  cancelBooking,
} = require('../controllers/bookingController');

// Public endpoints for booking flow
router.post('/', createBooking);
router.get('/availability', getAvailability);
router.get('/', getBookings);
router.get('/:id', getBookingById);
router.patch('/:id/cancel', cancelBooking);

module.exports = router;

