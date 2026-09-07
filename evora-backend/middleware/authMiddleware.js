const jwt = require('jsonwebtoken');
const { ApiError } = require('../utils/helper');

// Verifies a Bearer JWT and attaches the decoded payload to req.user.
// Use this to protect station create/update/delete routes.
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Not authorized, no token provided');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new ApiError(401, 'Not authorized, malformed token');
    }

    if (!process.env.JWT_SECRET) {
      throw new ApiError(500, 'Server misconfiguration: JWT_SECRET is not set');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Not authorized, token expired'));
    }
    if (err.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Not authorized, invalid token'));
    }
    next(err);
  }
};

// Optional: restrict a route to specific roles, e.g. authorize('admin')
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, 'Forbidden: insufficient permissions'));
  }
  next();
};

module.exports = { protect, authorize };
