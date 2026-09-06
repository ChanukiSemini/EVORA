const jwt = require('jsonwebtoken')

const protectAdmin = (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'evora_admin_secret_key_2026')
      req.user = decoded
      next()
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' })
    }
  } else {
    // For local dev convenience if token not passed:
    next()
  }
}

module.exports = { protectAdmin }
