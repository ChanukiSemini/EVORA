// Standard success envelope used across all controllers
const sendResponse = (res, statusCode, data, meta = undefined) => {
  const body = { success: true, data };
  if (meta !== undefined) body.meta = meta;
  return res.status(statusCode).json(body);
};

// Custom error carrying an HTTP status code, caught by errorMiddleware
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Wraps async route handlers so rejected promises reach errorMiddleware
// instead of crashing the process or hanging the request.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Turns "page"/"limit" query params into safe, bounded numbers + a mongo skip value
const getPagination = (query, defaultLimit = 12, maxLimit = 50) => {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  page = Number.isFinite(page) && page > 0 ? page : 1;
  limit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, maxLimit) : defaultLimit;

  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// Turns a comma-separated query string into a trimmed array, or undefined if absent
const parseCsvParam = (value) => {
  if (!value || typeof value !== 'string') return undefined;
  const items = value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
  return items.length ? items : undefined;
};

module.exports = { sendResponse, ApiError, asyncHandler, getPagination, parseCsvParam };
