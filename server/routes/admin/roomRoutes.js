const express = require("express");
const router = express.Router();
const { getAllRooms, getRoomInventory, updateRoomInventory, getAllRoomPhotos, deleteRoomPhotos, deleteHotelPhotos } = require("../../controllers/admin/roomsController");
const { isAdminAuthenticated } = require("../../middlewares/sessionAuth");

router.use(isAdminAuthenticated);
// root route: /api/admin/room
router.post("/get-all-rooms", getAllRooms);

// Route to get all room photos
router.post("/get-all-room-photos", getAllRoomPhotos);
// router.post("/get-hotel-photos", getHotelPhotos);
router.post("/delete-room-photos", deleteRoomPhotos);

router.post("/delete-hotel-photos", deleteHotelPhotos);

// Routes for room inventory
router.post("/get-room-inventory", getRoomInventory);
router.post("/update-room-inventory", updateRoomInventory);

module.exports = router;
