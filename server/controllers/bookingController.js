const sequelize = require("../config/db");
const { Op } = require("sequelize");
const { getModels } = require("../models/init-models.js");
const { Bookings, Hotels, Rooms } = getModels();

const getAllBookings = async (req, res) => {
  try {
    const buyerId = req.session.user.user_id;

    await Bookings.update(
      {
        status: sequelize.literal(`CASE
            WHEN (CURRENT_DATE() BETWEEN check_in_date AND check_out_date) THEN 'checked in'
            WHEN CURRENT_DATE() > check_out_date THEN 'completed'
            ELSE status
            END`),
      },
      {
        where: {
          buyer_id: buyerId,
          status: {
            [Op.ne]: "cancelled",
          },
        },
      }
    );

    const bookings = await Bookings.findAll({
      where: { buyer_id: buyerId, status: { [Op.ne]: "cancelled" } },
      order: [["created_at", "DESC"]],
    });

    for (let booking of bookings) {
      const hotelId = booking.hotel_id;
      const hotelInformation = await Hotels.findOne({
        where: { hotel_id: hotelId },
        attributes: ["hotel_id", "name", "city", "image_urls"],
      });
      booking.hotel = hotelInformation;

      const roomId = booking.room_id;
      const roomInformation = await Rooms.findOne({
        where: { room_id: roomId },
        attributes: ["room_id", "room_name"],
      });
      booking.roomName = roomInformation.room_name;
    }
    res.status(200).json({ bookings: bookings });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllBookings,
};
