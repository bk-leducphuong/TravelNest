const router = require('express').Router();
const { getNotifications, markAllNotificationAsRead } = require('../../controllers/admin/notificationController');
const {isAdminAuthenticated} = require('../../middlewares/sessionAuth');

// root route: /api/admin/notifications
router.use(isAdminAuthenticated);
// Route to get notifications
router.post('/', getNotifications);
// Route to mark notification as read
router.get('/mark-all-as-read', markAllNotificationAsRead);

module.exports = router;