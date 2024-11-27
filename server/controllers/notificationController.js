const connection = require("../config/db");
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

module.exports = { getNotifications };