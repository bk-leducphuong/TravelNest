const router = require('express').Router();
const {
  getNotifications,
  markAllNotificationAsRead,
  markNotificationAsRead,
} = require('../../controllers/admin/notificationController');
const { isAdminAuthenticated } = require('../../middlewares/sessionAuth');

// root route: /api/admin/notifications
router.use(isAdminAuthenticated);
// Route to get notifications
router.post('/', getNotifications);
// Route to mark notification as read
router.post('/mark-all-as-read', markAllNotificationAsRead);

router.post('/mark-as-read', markNotificationAsRead);

module.exports = router;
