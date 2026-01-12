const { ApiError } = require('../utils/ApiError');
const { sessionMiddleware } = require('../config/session.config');
// Helper to make Express middleware work with Socket.io
const wrap = (middleware) => (socket, next) => {
  // socket.request is the underlying HTTP request object
  middleware(socket.request, {}, next);
};
const sessionSocketMiddleware = wrap(sessionMiddleware);

const authMiddleware = (socket, next) => {
  if (
    socket.request.session?.user?.user_id &&
    socket.request.session?.user?.userRole === 'customer'
  ) {
    return next(); // Proceed if authenticated
  }

  if (
    socket.request.session?.user?.user_id &&
    socket.request.session?.user?.userRole === 'partner'
  ) {
    return next(); // Proceed if authenticated
  }

  next(new ApiError(401, 'UNAUTHORIZED', 'Unauthorized access'));
};
module.exports = { wrap, sessionSocketMiddleware, authMiddleware };
