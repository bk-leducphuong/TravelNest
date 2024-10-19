const express = require('express');
const router = express.Router();
const { getSearchHotels, getHotel } = require('../controllers/hotelController');

// Route to search hotels
router.post('/search', getSearchHotels);
// Route to fetch detailed information about s single hotel
router.get('/:id', getHotel);
// 


module.exports = router;
