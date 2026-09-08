// controllers/driverController.js
//
// Purpose: handles fetching, updating, password changing, soft-deactivating,
// and permanently deleting a driver's profile in MongoDB Atlas (ev_driver collection).

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const EvDriver = require('../models/EvDriver');
const ChargerHost = require('../models/ChargerHost');

// Helper to find driver across User / EvDriver / ChargerHost models
async function findUserById(id) {
    if (!id) return null;
    let user = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
        user = await User.findById(id);
        if (!user) user = await ChargerHost.findById(id);
    }
    if (!user) {
        user = await User.findOne({ $or: [{ email: id }, { _id: id }] });
    }
    return user;
}

// GET /api/drivers/:id — fetch driver/user profile details
async function getDriver(req, res) {
    try {
        const { id } = req.params;
        let driver = await findUserById(id);

        // Fallback to first active driver if ID is a placeholder or not found
        if (!driver) {
            driver = await User.findOne({ active: true });
        }

        if (!driver) {
            return res.status(404).json({ success: false, message: 'Driver profile not found' });
        }

        const userObj = {
            _id: driver._id,
            id: driver._id,
            name: driver.name || driver.fullName || 'EV Driver',
            fullName: driver.fullName || driver.name || 'EV Driver',
            email: driver.email,
            phone: driver.phone || '',
            avatarUrl: driver.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            role: driver.role || 'driver',
            active: driver.active !== false,
            vehicleCategory: driver.vehicleCategory || '',
            connectorType: driver.connectorType || '',
            vehicleModel: driver.vehicleModel || '',
            vehicleRegNumber: driver.vehicleRegNumber || '',
            createdAt: driver.createdAt,
            updatedAt: driver.updatedAt
        };

        res.status(200).json(userObj);
    } catch (error) {
        console.error('getDriver error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// PATCH /api/drivers/:id — update editable profile fields
async function updateDriver(req, res) {
    try {
        const { id } = req.params;
        const { name, fullName, email, phone, avatarUrl, vehicleCategory, connectorType, vehicleModel, vehicleRegNumber } = req.body;

        let user = await findUserById(id);
        if (!user) {
            user = await User.findOne({ active: true });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'Driver not found' });
        }

        // Check if updating email to another account's email
        if (email && email.toLowerCase().trim() !== user.email?.toLowerCase().trim()) {
            const existingEmail = await User.findOne({
                email: email.toLowerCase().trim(),
                _id: { $ne: user._id }
            });
            if (existingEmail) {
                return res.status(409).json({ success: false, message: 'Email is already registered with another account' });
            }
            user.email = email.toLowerCase().trim();
        }

        const displayName = fullName || name;
        if (displayName) {
            user.name = displayName.trim();
            user.fullName = displayName.trim();
        }

        if (phone !== undefined) user.phone = phone.trim();
        if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
        if (vehicleCategory !== undefined) user.vehicleCategory = vehicleCategory;
        if (connectorType !== undefined) user.connectorType = connectorType;
        if (vehicleModel !== undefined) user.vehicleModel = vehicleModel;
        if (vehicleRegNumber !== undefined) user.vehicleRegNumber = vehicleRegNumber;

        await user.save();

        const responseObj = {
            _id: user._id,
            id: user._id,
            name: user.name || user.fullName,
            fullName: user.fullName || user.name,
            email: user.email,
            phone: user.phone || '',
            avatarUrl: user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            role: user.role || 'driver',
            active: user.active !== false,
            vehicleCategory: user.vehicleCategory || '',
            connectorType: user.connectorType || '',
            vehicleModel: user.vehicleModel || '',
            vehicleRegNumber: user.vehicleRegNumber || '',
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            driver: responseObj,
            ...responseObj
        });
    } catch (error) {
        console.error('updateDriver error:', error);
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Email or phone already in use' });
        }
        res.status(400).json({ success: false, message: error.message });
    }
}

// PATCH /api/drivers/:id/password — update driver password
async function updatePassword(req, res) {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
        }

        let user = await findUserById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Driver not found' });
        }

        // Verify current password if provided
        if (currentPassword && user.password) {
            const isMatch = await user.matchPassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Current password is incorrect' });
            }
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('updatePassword error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// PATCH /api/drivers/:id/deactivate — soft delete: sets active to false
async function deactivateDriver(req, res) {
    try {
        const { id } = req.params;
        let user = await findUserById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Driver not found' });
        }

        user.active = false;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile deactivated successfully',
            driver: { _id: user._id, active: false }
        });
    } catch (error) {
        console.error('deactivateDriver error:', error);
        res.status(400).json({ success: false, message: error.message });
    }
}

// DELETE /api/drivers/:id — hard delete: removes record from database
async function deleteDriver(req, res) {
    try {
        const { id } = req.params;
        let deleted = null;

        if (mongoose.Types.ObjectId.isValid(id)) {
            deleted = await User.findByIdAndDelete(id);
            if (!deleted) {
                deleted = await ChargerHost.findByIdAndDelete(id);
            }
        } else {
            deleted = await User.findOneAndDelete({ email: id });
        }

        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Driver profile not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Profile permanently deleted successfully'
        });
    } catch (error) {
        console.error('deleteDriver error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    getDriver,
    updateDriver,
    updatePassword,
    deactivateDriver,
    deleteDriver
};