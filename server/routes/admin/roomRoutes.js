const express = require("express");
const router = express.Router();
const { getAllRooms, getRoomInventory } = require("../../controllers/admin/roomsController");
const { isAdminAuthenticated } = require("../../middlewares/sessionAuth");

router.use(isAdminAuthenticated);
// root route: /api/admin/room
router.post("/get-all-rooms", getAllRooms);

router.post("/get-room-inventory", getRoomInventory);

module.exports = router;
