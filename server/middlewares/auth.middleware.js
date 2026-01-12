// Middleware: Ensure user is authenticated
function isUserAuthenticated(req, res, next) {
  if (
    req.session?.user?.user_id &&
    req.session?.user?.userRole === 'customer'
  ) {
    return next(); // Proceed if authenticated
  }
  return res
    .status(401)
    .json({ success: false, message: 'Unauthorized access. Please log in.' });
}

function isAdminAuthenticated(req, res, next) {
  if (req.session?.user?.user_id && req.session?.user?.userRole === 'partner') {
    return next(); // Proceed if authenticated
  }
  return res
    .status(401)
    .json({ success: false, message: 'Unauthorized access. Please log in.' });
}

module.exports = { isUserAuthenticated, isAdminAuthenticated };
