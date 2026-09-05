const express = require('express');
const router = express.Router();

const {
  getStations,
  getStationById,
  createStation,
  updateStation,
  deleteStation,
} = require('../controllers/stationController');

const { protect } = require('../middleware/authMiddleware');

// Public — powers FindStation.jsx (list, search, filter, sort, pagination)
router.get('/', getStations);

// Public — powers StationDetails.jsx (/station/:id)
router.get('/:id', getStationById);

// Protected — station management (e.g. an admin dashboard)
router.post('/', protect, createStation);
router.put('/:id', protect, updateStation);
router.delete('/:id', protect, deleteStation);

module.exports = router;
