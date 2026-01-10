const { UserNotifications } = require('../models/index.js');
const { Op } = require('sequelize');

/**
 * Notification Repository - Contains all database operations for notifications
 * Only repositories may import Sequelize models
 */

class NotificationRepository {
  /**
   * Find all notifications for a user
   */
  async findByUserId(userId, options = {}) {
    const { limit, offset, unreadOnly = false } = options;

    const where = {
      reciever_id: userId,
    };

    if (unreadOnly) {
      where.is_read = false;
    }

    return await UserNotifications.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: limit || undefined,
      offset: offset || undefined,
    });
  }

  /**
   * Find notification by ID
   */
  async findById(notificationId) {
    return await UserNotifications.findOne({
      where: { notification_id: notificationId },
    });
  }

  /**
   * Update notification by ID
   */
  async updateById(notificationId, updateData) {
    return await UserNotifications.update(updateData, {
      where: { notification_id: notificationId },
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsReadByUserId(userId) {
    return await UserNotifications.update(
      { is_read: true },
      {
        where: {
          reciever_id: userId,
          notification_id: { [Op.gt]: 0 }, // All notifications
        },
      }
    );
  }

  /**
   * Mark notification as read by ID
   */
  async markAsReadById(notificationId) {
    return await UserNotifications.update(
      { is_read: true },
      {
        where: {
          notification_id: notificationId,
        },
      }
    );
  }

  /**
   * Count unread notifications for a user
   */
  async countUnreadByUserId(userId) {
    return await UserNotifications.count({
      where: {
        reciever_id: userId,
        is_read: false,
      },
    });
  }
}

module.exports = new NotificationRepository();
