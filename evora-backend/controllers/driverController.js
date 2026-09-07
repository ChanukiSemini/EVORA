// controllers/driverController.js
//
// Purpose: handles fetching, updating, and soft-deleting a driver's
// profile. "Delete" here means setting active: false, not removing
// the document — this preserves historical data (bookings, reviews)
// that reference this driver.

const EvDriver = require('../models/EvDriver');

// GET /api/drivers/:id — fetch one driver's profile details
async function getDriver(req, res) {
    try {
        const driver = await EvDriver.findById(req.params.id);

        if (!driver || !driver.active) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        res.status(200).json(driver);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// PATCH /api/drivers/:id — update editable profile fields
async function updateDriver(req, res) {
    try {
        // Only these fields can be changed here — prevents someone from
        // sneaking in changes to fields like `active` or `createdAt`
        // through this endpoint
        const allowedUpdates = ['name', 'email', 'phone', 'age'];
        const updates = {};

        for (const field of allowedUpdates) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const updatedDriver = await EvDriver.findByIdAndUpdate(req.params.id, updates, {
            new: true,           // return the updated document
            runValidators: true, // enforce schema rules (e.g. required, unique)
        });

        if (!updatedDriver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        res.status(200).json(updatedDriver);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Email or phone already in use' });
        }
        res.status(400).json({ message: error.message });
    }
}

// PATCH /api/drivers/:id/deactivate — soft delete: sets active to false
async function deactivateDriver(req, res) {
    try {
        const deactivatedDriver = await EvDriver.findByIdAndUpdate(
            req.params.id,
            { active: false },
            { new: true }
        );

        if (!deactivatedDriver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        res.status(200).json({ message: 'Profile deactivated', driver: deactivatedDriver });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getDriver,
    updateDriver,
    deactivateDriver
};