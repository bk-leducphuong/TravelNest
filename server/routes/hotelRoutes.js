const express = require('express');
const router = express.Router();
const {
  getHotelDetails,
  searchRoom,
  checkRoomAvailability,
} = require('../controllers/hotelController');

// root route: /api/hotels
// Route to fetch detailed information about a single hotel
router.post('/get-hotel-details', getHotelDetails);
// Route to search available rooms for one specific hotel
router.post('/search-room', searchRoom);
// Route to check if room is available or not
router.post('/check-room-availability', checkRoomAvailability);

module.exports = router;
