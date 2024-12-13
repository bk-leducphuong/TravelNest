const router = require('express').Router();
const { getNotifications, markAllNotificationAsRead, markNotificationAsRead } = require('../controllers/notificationController');
const {isUserAuthenticated} = require('../middlewares/sessionAuth');

// root route: /api/notifications
router.use(isUserAuthenticated);
// Route to get notifications
router.get('/', getNotifications);
// Route to mark notification as read
router.get('/mark-all-as-read', markAllNotificationAsRead);

router.post('/mark-as-read', markNotificationAsRead);

module.exports = router;