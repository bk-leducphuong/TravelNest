/**
 * Admin Controllers Index
 * Exports all admin controllers
 */

const bookingController = require('./booking.controller');
const dashboardController = require('./dashboard.controller');
const hotelController = require('./hotel.controller');
const notificationController = require('./notification.controller');
const reviewController = require('./review.controller');
const roomController = require('./room.controller');

module.exports = {
  bookingController,
  dashboardController,
  hotelController,
  notificationController,
  reviewController,
  roomController,
};
