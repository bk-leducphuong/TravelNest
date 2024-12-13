const connection = require("../config/db");
const { promisify } = require("util");

const queryAsync = promisify(connection.query).bind(connection);

const getNotifications = async (req, res) => {
  try {
    const userId = req.session.user.user_id
    const query =  "SELECT * FROM user_notifications WHERE reciever_id = ? ORDER BY created_at DESC";
    
    const notifications = await queryAsync(query, [userId]);
    res.json({ notifications: notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).send({ error: "Failed to fetch notifications." });
  }
};

const markAllNotificationAsRead = async (req, res) => {
  try {
    const userId = req.session.user.user_id
    const query = "UPDATE user_notifications SET is_read = 1 WHERE notification_id > 0 AND reciever_id = ?";
    await queryAsync(query, [userId]);

    res.json({ success: true, message: "Notification marked as read." });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).send({ error: "Failed to mark notification as read." });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    const query = "UPDATE user_notifications SET is_read = 1 WHERE notification_id = ?";
    await queryAsync(query, [notificationId]);

    res.json({ success: true, message: "Notification marked as read." });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).send({ error: "Failed to mark notification as read." });
  }
};

module.exports = { getNotifications, markAllNotificationAsRead, markNotificationAsRead };