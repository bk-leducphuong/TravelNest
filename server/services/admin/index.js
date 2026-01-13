/**
 * Admin Services Index
 * Exports all admin services
 */

const adminBookingService = require('./booking.service');
const adminDashboardService = require('./dashboard.service');
const adminHotelService = require('./hotel.service');
const adminNotificationService = require('./notification.service');
const adminReviewService = require('./review.service');
const adminRoomService = require('./room.service');

module.exports = {
  adminBookingService,
  adminDashboardService,
  adminHotelService,
  adminNotificationService,
  adminReviewService,
  adminRoomService,
};
