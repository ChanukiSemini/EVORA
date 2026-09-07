// routes/driverRoutes.js
const express = require('express');
const { getDriver, updateDriver, deactivateDriver } = require('../controllers/driverController');

const router = express.Router();

router.get('/:id', getDriver);
router.patch('/:id', updateDriver);
router.patch('/:id/deactivate', deactivateDriver);

module.exports = router;