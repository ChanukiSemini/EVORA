// routes/driverRoutes.js
const express = require('express');
const {
    getDriver,
    updateDriver,
    updatePassword,
    deactivateDriver,
    deleteDriver
} = require('../controllers/driverController');

const router = express.Router();

router.get('/:id', getDriver);
router.patch('/:id', updateDriver);
router.put('/:id', updateDriver);
router.patch('/:id/password', updatePassword);
router.patch('/:id/deactivate', deactivateDriver);
router.delete('/:id', deleteDriver);

module.exports = router;