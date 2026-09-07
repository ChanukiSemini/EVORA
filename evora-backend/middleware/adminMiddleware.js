const jwt = require('jsonwebtoken')
const User = require('../models/User')
const ChargerHost = require('../models/ChargerHost')

const protectAdmin = async (req, res, next) => {
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
        user = await ChargerHost.findById(userId).select('-password')
        if (!user) {
          user = await User.findById(userId).select('-password')
        }
      }
      req.user = user || decoded
      next()
    } catch (error) {
      // In development mode, allow continuing or return 401
      return res.status(401).json({ message: 'Not authorized, token failed' })
    }
  } else {
    // For local dev convenience if token not passed:
    next()
  }
}

module.exports = { protectAdmin }

