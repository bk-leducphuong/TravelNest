const express = require('express');
const router = express.Router();
const { getRecentViewHotels, getRecentSearchs, getPopularPlaces, getNearByHotels, postRecentViewHotels, postRecentSearchs} = require('../controllers/homeController');

// Route to fetch all recently viewed hotels
router.get('/recent-view-hotels', getRecentViewHotels);
// Route to save all recently viewed hotels
router.get('/recent-view-hotels', postRecentViewHotels);
// Route to fetch all recently searchs
router.get('/recent-searchs', getRecentSearchs);
// Route to save all recently searchs
router.post('/recent-searchs', postRecentSearchs);
// Route to fetch all top most searched places (popular places)
router.get('/popular-places', getPopularPlaces);
// Route to fetch all near by hotels
router.post('/nearby-hotels', getNearByHotels);

module.exports = router;