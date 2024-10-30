const express = require('express');
const router = express.Router();
const { getRecentViewedHotels, getRecentSearchs, getPopularPlaces, getNearByHotels, postRecentViewedHotels, postRecentSearchs} = require('../controllers/homeController');
const isAuthenticated = require('../middlewares/sessionAuth');

// Route to fetch all recently viewed hotels
router.get('/recent-viewed-hotels', isAuthenticated, getRecentViewedHotels);
// Route to save all recently viewed hotels
router.post('/recent-viewed-hotels', isAuthenticated, postRecentViewedHotels);
// Route to fetch all recently searchs
router.get('/recent-searchs', isAuthenticated, getRecentSearchs);
// Route to save all recently searchs
router.post('/recent-searchs', isAuthenticated, postRecentSearchs);
// Route to fetch all top most searched places (popular places)
router.get('/popular-places', getPopularPlaces);
// Route to fetch all near by hotels
router.post('/nearby-hotels', getNearByHotels);

module.exports = router;