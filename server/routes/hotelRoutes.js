const express = require('express');
const router = express.Router();
const { getHotelDetails, searchRoom } = require('../controllers/hotelController');


// Route to fetch detailed information about a single hotel
router.get('/:hotelId', getHotelDetails);
// Route to search available rooms for one specific hotel
router.post('/search-room', searchRoom);

module.exports = router;
