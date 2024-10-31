const express = require('express');
const router = express.Router();
const { getHotelDetails } = require('../controllers/hotelController');


// Route to fetch detailed information about s single hotel
router.get('/:hotel_id', getHotelDetails);
// 


module.exports = router;
