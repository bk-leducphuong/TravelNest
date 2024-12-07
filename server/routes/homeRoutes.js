const express = require('express');
const router = express.Router();
const { getRecentViewedHotels, getRecentSearchs, getPopularPlaces, getNearByHotels, postRecentViewedHotels, postRecentSearchs} = require('../controllers/homeController');
const {isAdminAuthenticated, isUserAuthenticated} = require('../middlewares/sessionAuth');

// root route: /api/home
// Route to fetch all recently viewed hotels
router.post('/get-recent-viewed-hotels', getRecentViewedHotels);
// Route to save all recently viewed hotels
router.post('/post-recent-viewed-hotels', isUserAuthenticated, postRecentViewedHotels);
// Route to fetch all recently searchs
router.get('/recent-searchs', isUserAuthenticated, getRecentSearchs);
// Route to fetch all top most searched places (popular places)
router.get('/popular-places', getPopularPlaces);
// Route to fetch all near by hotels
router.post('/nearby-hotels', getNearByHotels);

module.exports = router;