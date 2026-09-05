// routes/bookingRoutes.js
import express from 'express';
import { getBookingForReview } from '../controllers/bookingController.js';

const router = express.Router();

// GET /api/bookings/:id — booking details + station/connector/vehicle populated,
// used by the Review page to display what the driver is reviewing
router.get('/:id', getBookingForReview);

export default router;