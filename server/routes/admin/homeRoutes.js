const express = require('express')
const router = express.Router()
const {getTotalBookings} = require('../../controllers/admin/homeController')
const {isAdminAuthenticated} = require('../../middlewares/sessionAuth')

// root route: /admin/home
router.use(isAdminAuthenticated)

router.post('/get-total-bookings',  getTotalBookings)

module.exports = router