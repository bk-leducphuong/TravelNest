const connection = require("../../config/db");
const { promisify } = require("util");

const queryAsync = promisify(connection.query).bind(connection);

const getNotifications = async (req, res) => {
  try {
    const { hotelId } = req.body;
    const query =  "SELECT * FROM notifications WHERE reciever_id = ? ORDER BY created_at DESC";
    
    const notifications = await queryAsync(query, [hotelId]);
    res.json({ notifications: notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).send({ error: "Failed to fetch notifications." });
  }
};

const markAllNotificationAsRead = async (req, res) => {
  try {
    const query = "UPDATE notifications SET is_read = 1 WHERE notification_id > 0";
    await queryAsync(query);

    res.json({ success: true, message: "Notification marked as read." });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).send({ error: "Failed to mark notification as read." });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    const query = "UPDATE notifications SET is_read = 1 WHERE notification_id = ?";
    await queryAsync(query, [notificationId]);

    res.json({ success: true, message: "Notification marked as read." });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).send({ error: "Failed to mark notification as read." });
  }
};

module.exports = { getNotifications, markAllNotificationAsRead, markNotificationAsRead };