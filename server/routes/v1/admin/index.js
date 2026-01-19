/**
 * Admin Routes Index
 * Exports all admin routes
 */

const express = require('express');
const router = express.Router();

const bookingRoutes = require('./booking.routes');
const dashboardRoutes = require('./dashboard.routes');
const hotelRoutes = require('./hotel.routes');
const notificationRoutes = require('./notification.routes');
const reviewRoutes = require('./review.routes');
const roomRoutes = require('./room.routes');

// Mount admin routes
router.use('/bookings', bookingRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/hotels', hotelRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reviews', reviewRoutes);
router.use('/rooms', roomRoutes);

module.exports = router;
