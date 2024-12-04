const express = require("express");
const router = express.Router();
const { getAllRooms, getRoomInventory, updateRoomInventory } = require("../../controllers/admin/roomsController");
const { isAdminAuthenticated } = require("../../middlewares/sessionAuth");

router.use(isAdminAuthenticated);
// root route: /api/admin/room
router.post("/get-all-rooms", getAllRooms);

router.post("/get-room-inventory", getRoomInventory);

router.post("/update-room-inventory", updateRoomInventory);

module.exports = router;
