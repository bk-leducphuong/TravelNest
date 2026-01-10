const express = require('express');
const router = express.Router();
const {
  getTotalBookings,
  getRevenueStats,
  getDailyRevenueChart,
  getRoomBooks,
  getNewCustomers,
  calculateWeeklyChange,
} = require('../../controllers/admin/homeController');
const { isAdminAuthenticated } = require('../../middlewares/sessionAuth');

// Root route: /admin/home
router.use(isAdminAuthenticated);

// Các route thống kê cho dashboard admin
router.post('/get-total-bookings', getTotalBookings);
router.post('/get-revenue-stats', getRevenueStats); // tổng thu nhập trong 1 khoảng thời gian
router.post('/get-daily-revenue-chart', getDailyRevenueChart); //tong thu nhap tung nhap theo ngày
router.post('/get-room-book', getRoomBooks); // so luong phong dat trong 1 khoảng thời gian
router.post('/get-new-customers', getNewCustomers); // cac new customers trong 1 khoảng thời gian
router.post('/calculate-weekly-change', calculateWeeklyChange); // tính toán sự thay đổi tuần này so với tuân trước

module.exports = router;
