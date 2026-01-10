const { getModels } = require('../../models/init-models.js');
const { Bookings, Invoices, Rooms, Users } = getModels();
const { Op, Sequelize } = require('sequelize');

const getTotalBookings = async (req, res) => {
  try {
    const { period, hotelId } = req.body;
    const bookings = await Bookings.findAll({
      where: {
        hotel_id: hotelId,
        created_at: {
          [Op.between]: [period.start, period.end],
        },
      },
    });
    res.status(200).json({ totalBookings: bookings.length });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// tổng thu nhập trong 1 khoảng thời giangian
const getRevenueStats = async (req, res) => {
  try {
    const { hotelId, period } = req.body;

    if (!hotelId || !period || !period.start || !period.end) {
      return res.status(400).json({ message: 'Invalid input parameters' });
    }

    const revenue = await Bookings.update(
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
            [Op.ne]: 'cancelled',
          },
        },
      }
    );

    res.status(200).json({ revenueStats: revenue || 0 });
  } catch (error) {
    console.error('Error in getRevenueStats:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// doanh thu của hotel theo từng ngàyngày
const getDailyRevenueChart = async (req, res) => {
  try {
    const { hotelId, period } = req.body;

    if (!hotelId || !period || !period.start || !period.end) {
      return res.status(400).json({ message: 'Invalid input parameters' });
    }

    const results = await Invoices.findAll({
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('created_at')), 'date'],
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'revenue'],
      ],
      where: {
        hotel_id: hotelId,
        created_at: {
          [Op.between]: [period.start, period.end],
        },
      },
      group: [Sequelize.fn('DATE', Sequelize.col('created_at'))],
      order: [[Sequelize.fn('DATE', Sequelize.col('created_at')), 'ASC']],
    });

    res.status(200).json({ dailyRevenueChart: results });
  } catch (error) {
    console.error('Error in getDailyRevenueChart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// số lượng phòng được đặt trong một khoảng thời gian
const getRoomBooks = async (req, res) => {
  try {
    const { hotelId, period } = req.body;

    if (!hotelId || !period || !period.start || !period.end) {
      return res.status(400).json({ message: 'Invalid input parameters' });
    }

    const roomSales = await Bookings.findAll({
      attributes: [
        'room_id',
        [Sequelize.fn('COUNT', Sequelize.col('*')), 'book_count'],
      ],
      where: {
        hotel_id: hotelId,
        created_at: {
          [Op.between]: [period.start, period.end],
        },
      },
      group: ['room_id'],
      raw: true,
    });

    for (const roomSale of roomSales) {
      const room = await Rooms.findOne({
        where: {
          room_id: roomSale.room_id,
        },
      });
      roomSale.roomName = room.room_name;
    }
    res.status(200).json({ roomSales: roomSales });
  } catch (error) {
    console.error('Error in getRoomSales:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// số lượng người mới đăng ký trong một khoảng thời gian
const getNewCustomers = async (req, res) => {
  try {
    const { period, hotelId } = req.body;

    if (!hotelId || !period || !period.start || !period.end) {
      return res.status(400).json({ message: 'Invalid input parameters' });
    }

    const newCustomers = await Users.findAll({
      attributes: ['username', 'email', 'profile_picture_url'],
      distinct: true,
      include: [
        {
          model: Bookings,
          as: 'bookings',
          attributes: [],
          required: true,
          where: {
            hotel_id: hotelId,
            status: {
              [Op.in]: ['confirmed', 'checked in', 'completed'],
            },
            created_at: {
              [Op.between]: [period.start, period.end],
            },
            buyer_id: {
              [Op.notIn]: Sequelize.literal(`
          SELECT DISTINCT buyer_id 
          FROM bookings 
          WHERE hotel_id = ${hotelId}
          AND status IN ('confirmed', 'checked in', 'completed')
          AND created_at < '${period.start}'
        `),
            },
          },
        },
      ],
      raw: true,
    });
    res.status(200).json({ newCustomers: newCustomers });
  } catch (error) {
    console.error('Error in getNewCustomers:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// tính toán sự thay đổi tuần này so với tuân trước
const calculateWeeklyChange = async (req, res) => {
  try {
    const { currentWeek, previousWeek, hotelId } = req.body;

    if (!currentWeek || !previousWeek || !hotelId) {
      return res.status(400).json({ message: 'Invalid input parameters' });
    }

    const currentRevenue = await Invoices.sum('amount', {
      where: {
        hotel_id: hotelId,
        [Op.between]: [currentWeek.start, currentWeek.end],
      },
    });
    const previousRevenue = await Invoices.sum('amount', {
      where: {
        hotel_id: hotelId,
        [Op.between]: [previousWeek.start, previousWeek.end],
      },
    });

    const change = previousRevenue
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

    res.status(200).json({
      weeklyChange: {
        current: currentRevenue,
        previous: previousRevenue,
        change,
      },
    });
  } catch (error) {
    console.error('Error in calculateWeeklyChange:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getTotalBookings,
  getRevenueStats,
  getDailyRevenueChart,
  getRoomBooks,
  getNewCustomers,
  calculateWeeklyChange,
};
