const sequelize = require('../config/db');
const { Sequelize, Op, DataTypes } = require('sequelize');
const UserNotifications = require('../models/user_notifications')(sequelize, DataTypes);

const getNotifications = async (req, res) => {
  try {
    const userId = req.session.user.user_id;
    const notifications = await UserNotifications.findAll({
      where: {
        reciever_id: userId
      },
      order: [['created_at', 'DESC']]
    });
    
    res.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).send({ error: "Failed to fetch notifications." });
  }
};

const markAllNotificationAsRead = async (req, res) => {
  try {
    const userId = req.session.user.user_id;
    await UserNotifications.update(
      { is_read: true },
      {
        where: {
          reciever_id: userId,
          notification_id: { [Op.gt]: 0 }
        }
      }
    );

    res.json({ success: true, message: "Notification marked as read." });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).send({ error: "Failed to mark notification as read." });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    await UserNotifications.update(
      { is_read: true },
      {
        where: {
          notification_id: notificationId
        }
      }
    );

    res.json({ success: true, message: "Notification marked as read." });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).send({ error: "Failed to mark notification as read." });
  }
};

module.exports = { getNotifications, markAllNotificationAsRead, markNotificationAsRead };