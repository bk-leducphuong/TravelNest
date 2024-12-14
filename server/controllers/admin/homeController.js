const connection = require('../../config/db')
const {promisify} = require('util')

const queryAsync = promisify(connection.query).bind(connection)

const getTotalBookings = async (req, res) => {
    try {
        const { period, hotelId } = req.body
        const query = `SELECT COUNT(*) as total_bookings FROM bookings WHERE hotel_id = ? AND created_at BETWEEN ? AND ? `;
        const results = await queryAsync(query, [hotelId, period.start, period.end])
        res.status(200).json({totalBookings: results[0].total_bookings})
    }catch(error) {
        console.log(error)
        res.status(500).json({message: 'Internal Server Error'})
    }
}

// tổng thu nhập trong 1 khoảng thời giangian
const getRevenueStats = async (req, res) => {
    try {
      const { hotelId, period } = req.body;
  
      if (!hotelId || !period || !period.start || !period.end) {
        return res.status(400).json({ message: 'Invalid input parameters' });
      }
  
      const query = `
        SELECT SUM(amount) AS total_revenue
        FROM invoices
        WHERE hotel_id = ? AND created_at BETWEEN ? AND ?
      `;
      const results = await queryAsync(query, [hotelId, period.start, period.end]);
  
      res.status(200).json({ revenueStats: results[0]?.total_revenue || 0 });
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
  
      const query = `
        SELECT DATE(created_at) AS date, SUM(amount) AS revenue
        FROM invoices
        WHERE hotel_id = ? AND created_at BETWEEN ? AND ?
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at) ASC
      `;
      const results = await queryAsync(query, [hotelId, period.start, period.end]);
  
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
  
      const query = `
        SELECT room_id, COUNT(*) AS book_count
        FROM bookings
        WHERE hotel_id = ? AND created_at BETWEEN ? AND ?
        GROUP BY room_id
      `;
      const results = await queryAsync(query, [hotelId, period.start, period.end]);
  
      res.status(200).json({ roomSales: results });
    } catch (error) {
      console.error('Error in getRoomSales:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

  // số lượng người mới đăng ký trong một khoảng thời gian
  const getNewCustomers = async (req, res) => {
    try {
      const { period,hotelId } = req.body;
  
      if (!hotelId || !period || !period.start || !period.end) {
        return res.status(400).json({ message: 'Invalid input parameters' });
      }

      const query = `
          SELECT DISTINCT u.username AS new_customers
          FROM bookings b1
          join users u on b1.buyer_id = u.user_id
          WHERE hotel_id = ?
            AND status IN ('confirmed', 'checked in', 'completed') 
            AND b1.created_at BETWEEN ? AND ? 
            AND buyer_id NOT IN (
                SELECT DISTINCT buyer_id
                FROM bookings b2
                WHERE hotel_id = ?
                  AND status IN ('confirmed', 'checked in', 'completed')
                  AND created_at < ?
            )`;
      const results = await queryAsync(query, [hotelId, period.start, period.end, hotelId, period.start]);
      res.status(200).json({ newCustomers: results });
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
  
      const currentQuery = `
        SELECT SUM(amount) AS revenue
        FROM invoices
        WHERE hotel_id = ? AND created_at BETWEEN ? AND ?
      `;
      const previousQuery = `
        SELECT SUM(amount) AS revenue
        FROM invoices
        WHERE hotel_id = ? AND created_at BETWEEN ? AND ?
      `;
  
      const [currentResults, previousResults] = await Promise.all([
        queryAsync(currentQuery, [hotelId, currentWeek.start, currentWeek.end]),
        queryAsync(previousQuery, [hotelId, previousWeek.start, previousWeek.end]),
      ]);
  
      const currentRevenue = currentResults[0]?.revenue || 0;
      const previousRevenue = previousResults[0]?.revenue || 0;
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