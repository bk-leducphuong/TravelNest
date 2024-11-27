const router = require('express').Router();
const { getNotifications } = require('../controllers/notificationController');
const {isAdminAuthenticated} = require('../middlewares/sessionAuth');

// root route: /api/notifications
router.use(isAdminAuthenticated);
// Route to get notifications
router.post('/', getNotifications);

module.exports = router;