const initServer = async () => {
  require('dotenv').config({
    path:
      process.env.NODE_ENV === 'development'
        ? '.env.development'
        : '.env.production',
  });

  // Initialize logger
  const logger = require('./config/logger.config');

  // Database connection
  const sequelize = require('./config/database.config');
  await sequelize.authenticate();
  require('./models/index.js');
  logger.info('Database connected successfully');

  const express = require('express');
  const cors = require('cors');
  const bodyParser = require('body-parser');
  const errorMiddleware = require('./middlewares/error.middleware.js');
  const sessionMiddleware = require('./config/session.config');

  const app = express();

  // Allow nginx proxy'
  // app.set("trust proxy", 1);

  // stripe webhook endpoint
  // const { webhookController } = require("./controllers/webhookController.js"); // inside webhookController I have print "hello 2"
  // app.post(
  //   "/stripe/webhook",
  //   bodyParser.raw({ type: "application/json" }),
  //   webhookController,
  // );
  // Socket io
  const http = require('http');
  const { initSocket } = require('./socket/index');
  const server = http.createServer(app);
  initSocket(server);

  app.use(express.static('public'));
  app.use(
    cors({
      origin: process.env.CLIENT_HOST,
      methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );
  app.use(bodyParser.json({ limit: '50mb' })); // create application/json parser
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: false })); // create application/x-www-form-urlencoded parser

  // Configure Session
  app.use(sessionMiddleware);

  // Khởi tạo passport
  // const passport = require("passport");
  // require("./config/passport.config");
  // app.use(passport.initialize());
  // app.use(passport.session());

  // Rate limiter
  const limiter = require('./middlewares/rate-limitter.middleware');
  app.use(limiter);

  // User Routes
  const searchRoutes = require('./routes/search.routes.js');
  const hotelRoutes = require('./routes/hotel.routes.js');
  const authRoutes = require('./routes/auth.routes');
  const homeRoutes = require('./routes/home.routes.js');
  const joinRoutes = require('./routes/join.routes.js');
  const paymentRoutes = require('./routes/payment.routes.js');
  const userRoutes = require('./routes/user.routes.js');
  const reviewRoutes = require('./routes/review.routes.js');
  const bookingRoutes = require('./routes/booking.routes.js');
  const userNotificationRoutes = require('./routes/notification.routes.js');

  app.use('/api/search', searchRoutes);
  app.use('/api/home', homeRoutes);
  app.use('/api/hotels', hotelRoutes);
  app.use('/api/auth', authRoutes); // Login route
  app.use('/api/join', joinRoutes); // Become a partner route
  app.use('/api/payments', paymentRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/notifications', userNotificationRoutes);

  // Admin routes
  // const adminPayoutRoutes = require('./routes/admin/payoutRoutes.js');
  // const bookingsRoutes = require('./routes/admin/bookingsRoutes.js');
  // const hotelsManagementRoutes = require('./routes/admin/hotelsManagementRoutes.js');
  // const roomRoutes = require('./routes/admin/roomRoutes.js');
  // const adminReviewRoutes = require('./routes/admin/reviewRoutes.js');
  // const adminCancelRoutes = require('./routes/admin/cancelRoutes.js');
  // const adminNotificationRoutes = require('./routes/admin/notificationRoutes.js');
  // const adminHomeRoutes = require('./routes/admin/homeRoutes.js');
  //
  // app.use('/api/admin/home', adminHomeRoutes);
  // app.use('/api/admin/notifications', adminNotificationRoutes);
  // app.use('/api/admin/hotels-management', hotelsManagementRoutes);
  // app.use('/api/admin/payout', adminPayoutRoutes);
  // app.use('/api/admin/bookings', bookingsRoutes);
  // app.use('/api/admin/room', roomRoutes);
  // app.use('/api/admin/review', adminReviewRoutes);
  // app.use('/api/admin/cancel-booking', adminCancelRoutes);

  app.use(errorMiddleware);

  // Default route
  app.get('/', (req, res) => {
    res.send('Welcome to the Hotel Booking API');
  });

  // Start the server
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, async () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

initServer();
