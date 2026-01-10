const { getModels } = require('../../models/init-models.js');
const { Bookings, Users } = getModels();
const { Op, Sequelize } = require('sequelize');

const getAllBookings = async (req, res) => {
  try {
    const { hotelId } = req.body;
    console.log(hotelId);
    // update status booking
    await Bookings.update(
      {
        status: Sequelize.literal(`CASE 
      WHEN (CURRENT_DATE() BETWEEN check_in_date AND check_out_date) THEN 'checked in'
      WHEN CURRENT_DATE() > check_out_date THEN 'completed'
      ELSE status
    END`),
      },
      {
        where: {
          hotel_id: hotelId,
          status: {
            [Op.net]: 'cancelled',
          },
        },
      }
    );
    const bookings = await Bookings.findAll({
      where: {
        hotel_id: hotelId,
      },
    });

    res.status(200).json({ bookings: bookings });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getBookerInformation = async (req, res) => {
  try {
    const { buyer_id } = req.body;
    const bookerInformation = await Users.findOne({
      where: {
        user_id: buyer_id,
      },
      attributes: ['username', 'email', 'country'],
    });
    res.status(200).json({ bookerInformation: bookerInformation });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllBookings,
  getBookerInformation,
};
