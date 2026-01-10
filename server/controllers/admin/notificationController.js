const { getModels } = require('../../models/init-models.js');
const { Notifications } = getModels();
const { Op } = require('sequelize');

const getNotifications = async (req, res) => {
  try {
    const { hotelId } = req.body;
    const notifications = await Notifications.findAll({
      where: {
        reciever_id: hotelId,
      },
      order: [['created_at', 'DESC']],
    });

    res.json({ notifications: notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).send({ error: 'Failed to fetch notifications.' });
  }
};

const markAllNotificationAsRead = async (req, res) => {
  try {
    const { hotelId } = req.body;
    await Notifications.update(
      {
        is_read: 1,
      },
      {
        where: {
          reciever_id: hotelId,
          notification_id: {
            [Op.gt]: 0,
          },
        },
      }
    );

    res.json({ success: true, message: 'Notification marked as read.' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).send({ error: 'Failed to mark notification as read.' });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    await Notifications.update(
      {
        is_read: 1,
      },
      {
        where: {
          notification_id: notificationId,
        },
      }
    );

    res.json({ success: true, message: 'Notification marked as read.' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).send({ error: 'Failed to mark notification as read.' });
  }
};

module.exports = {
  getNotifications,
  markAllNotificationAsRead,
  markNotificationAsRead,
};
