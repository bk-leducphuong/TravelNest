const { Op } = require('sequelize');
const { Notifications } = require('../models/index.js');

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

    return await Notifications.findAndCountAll({
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
    return await Notifications.findOne({
      where: { notification_id: notificationId },
    });
  }

  /**
   * Update notification by ID
   */
  async updateById(notificationId, updateData) {
    return await Notifications.update(updateData, {
      where: { notification_id: notificationId },
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsReadByUserId(userId) {
    return await Notifications.update(
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
    return await Notifications.update(
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
    return await Notifications.count({
      where: {
        reciever_id: userId,
        is_read: false,
      },
    });
  }
}

module.exports = new NotificationRepository();
