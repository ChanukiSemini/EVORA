const jwt = require('jsonwebtoken')
const User = require('../models/User')
const ChargerHost = require('../models/ChargerHost')

// Protect routes - verify Bearer token
const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'evora_jwt_super_secret_key_2026'
      )

      const userId = decoded.id || decoded._id || decoded.userId
      let user = null

      if (userId) {
        user = await User.findById(userId).select('-password')
        if (!user) {
          user = await ChargerHost.findById(userId).select('-password')
        }
      }

      req.user = user || (decoded ? { _id: userId, id: userId, role: decoded.role || 'user', ...decoded } : null)

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists or invalid token',
        })
      }

      next()
    } catch (error) {
      console.error('Auth verification error:', error.message)
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed or expired',
      })
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    })
  }
}

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user?.role || 'unknown'}' is not authorized to access this route`,
      })
    }
    next()
  }
}

module.exports = { protect, authorize }
