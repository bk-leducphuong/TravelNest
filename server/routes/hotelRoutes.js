const express = require('express');
const router = express.Router();
const { getSearchHotels, getHotel } = require('../controllers/hotelController');


// Route to fetch detailed information about s single hotel
router.get('/:id', getHotel);
// 


module.exports = router;
