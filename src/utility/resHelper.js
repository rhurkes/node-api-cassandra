/**
 * Helper that mutates the node response object by setting the status code and json response body.
 * @param {object} res node response object
 * @param {number} statusCode
 * @param {string} message
 */
function sendError(res, statusCode, message) {
  return res.status(statusCode).json({ message, status: statusCode });
}

module.exports = {
  sendError,
};
