const express = require('express')
const router = express.Router()
const {
  loginUser,
  registerUser,
  getUserProfile,
} = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

// Public routes
router.post('/login', loginUser)
router.post('/register', registerUser)

// Protected routes
router.get('/profile', protect, getUserProfile)

module.exports = router
