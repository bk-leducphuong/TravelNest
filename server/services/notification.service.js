const notificationRepository = require('../repositories/notification.repository');
const ApiError = require('../utils/ApiError');

/**
 * Notification Service - Contains main business logic
 * Follows RESTful API standards
 */

class NotificationService {
  /**
   * Get notifications for a user
   * @param {number} userId - User ID
   * @param {Object} options - Query options
   * @param {number} options.page - Page number (default: 1)
   * @param {number} options.limit - Items per page (default: 20, max: 100)
   * @param {boolean} options.unreadOnly - Only return unread notifications (default: false)
   * @returns {Promise<Object>} Notifications with pagination metadata
   */
  async getNotifications(userId, options = {}) {
    const { page = 1, limit = 20, unreadOnly = false } = options;

    // Validate limit
    const validatedLimit = Math.min(limit, 100);
    const offset = (page - 1) * validatedLimit;

    const result = await notificationRepository.findByUserId(userId, {
      limit: validatedLimit,
      offset,
      unreadOnly,
    });

    return {
      notifications: result.rows.map((notification) =>
        notification.toJSON ? notification.toJSON() : notification
      ),
      page,
      limit: validatedLimit,
      total: result.count,
    };
  }

  /**
   * Mark a specific notification as read
   * @param {number} notificationId - Notification ID
   * @param {number} userId - User ID (for authorization check)
   * @returns {Promise<void>}
   */
  async markNotificationAsRead(notificationId, userId) {
    // Verify notification exists and belongs to user
    const notification = await notificationRepository.findById(notificationId);

    if (!notification) {
      throw new ApiError(404, 'NOTIFICATION_NOT_FOUND', 'Notification not found');
    }

    if (notification.reciever_id !== userId) {
      throw new ApiError(
        403,
        'FORBIDDEN',
        'You do not have permission to mark this notification as read'
      );
    }

    // Mark as read
    const [updatedCount] = await notificationRepository.markAsReadById(
      notificationId
    );

    if (updatedCount === 0) {
      throw new ApiError(
        500,
        'UPDATE_FAILED',
        'Failed to mark notification as read'
      );
    }
  }

  /**
   * Mark all notifications as read for a user
   * @param {number} userId - User ID
   * @returns {Promise<number>} Number of notifications marked as read
   */
  async markAllNotificationsAsRead(userId) {
    const [updatedCount] = await notificationRepository.markAllAsReadByUserId(
      userId
    );

    return updatedCount;
  }

  /**
   * Get unread notification count for a user
   * @param {number} userId - User ID
   * @returns {Promise<number>} Count of unread notifications
   */
  async getUnreadCount(userId) {
    return await notificationRepository.countUnreadByUserId(userId);
  }
}

module.exports = new NotificationService();
