/*********************** External Libraries ************************/
require('dotenv').config({
  path:
    process.env.NODE_ENV === 'development'
      ? '.env.development'
      : '.env.production',
});
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');

/*********************** Config ************************/
const logger = require('./config/logger.config');
const sequelize = require('./config/database.config');
const { initSocket } = require('./socket/index');
const { initBucket } = require('./config/minio.config');

/*********************** Middlewares ************************/
const errorMiddleware = require('./middlewares/error.middleware.js');
const limiter = require('./middlewares/rate-limitter.middleware');
const sessionMiddleware = require('./middlewares/session.middleware');

/*********************** Routes ************************/
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
const adminRoutes = require('./routes/admin/index.js');

/*********************** Init Server ************************/
const initServer = async () => {
  // Database connection
  await sequelize.authenticate();
  require('./models/index.js');
  logger.info('Database connected successfully');

  const app = express();

  // Initialize s3 bucket
  await initBucket();

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
  app.use(limiter);

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

  // Admin routes - Refactored with RESTful standards
  app.use('/api/admin', adminRoutes);

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
