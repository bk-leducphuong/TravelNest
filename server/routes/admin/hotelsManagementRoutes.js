const router = require('express').Router();
const { isAdminAuthenticated } = require('../../middlewares/sessionAuth');
const {
  getAllManagingHotels,
} = require('../../controllers/admin/hotelsManagementController');

// root route: /api/admin/hotels-management
router.use(isAdminAuthenticated);

// Route to get all managing hotels
router.get('/', getAllManagingHotels);

module.exports = router;
