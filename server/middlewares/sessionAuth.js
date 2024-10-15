// Middleware: Ensure user is authenticated
export default function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next(); // Proceed if authenticated
  }
  return res.status(401).json({success: false, message: 'Unauthorized access. Please log in.' });
}