// Middleware: Ensure user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user.user_id) {
    return next(); // Proceed if authenticated
  }
  return res.status(401).json({success: false, message: 'Unauthorized access. Please log in.' });
}

module.exports = isAuthenticated;