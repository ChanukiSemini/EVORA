const express = require('express')
const router = express.Router()
const {
  loginUser,
  registerUser,
  getUserProfile,
  getVehicleModels,
  getConnectors,
} = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

// Public routes
router.post('/login', loginUser)
router.post('/register', registerUser)
router.get('/vehicle-models', getVehicleModels)
router.get('/connectors', getConnectors)

// Protected routes
router.get('/profile', protect, getUserProfile)

module.exports = router
