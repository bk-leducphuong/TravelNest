const express = require("express");
const router = express.Router();
// const { handleCancel } = require('../../controllers/admin/cancelController');
const { isAdminAuthenticated } = require("../../middlewares/sessionAuth");

router.use(isAdminAuthenticated);

// root route: /api/admin/cancel-booking
// router.post('/', handleCancel);

module.exports = router;

