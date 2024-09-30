const express = require('express');
const router = express.Router();
const { getAllHotels } = require('../controllers/hotelController');

// Route to fetch all hotels
router.get('/hotels', getAllHotels);
// Route to fetch detailed information about s single hotel
router.get('/hotels/:id', );
// Route to search hotel for specified location and availability based on dates.
router.get('/hotels/search?location=:location&date=:date')

module.exports = router;
