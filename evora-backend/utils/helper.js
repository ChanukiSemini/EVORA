// Utility helper functions

/**
 * Format response data standardized
 */
const formatResponse = (success, message, data = null) => {
  return {
    success,
    message,
    data,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  formatResponse
};
