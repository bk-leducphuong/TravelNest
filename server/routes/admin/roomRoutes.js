const express = require("express");
const router = express.Router();
const { getAllRooms, getRoomInventory, updateRoomInventory, getAllRoomPhotos, deleteRoomPhotos, deleteHotelPhotos, addRoomPhotos, addHotelPhotos } = require("../../controllers/admin/roomsController");
const upload = require("../../config/multer")
const { isAdminAuthenticated } = require("../../middlewares/sessionAuth");
 
router.use(isAdminAuthenticated);
// root route: /api/admin/room
router.post("/get-all-rooms", getAllRooms);

// Route to get all room photos
router.post("/get-all-room-photos", getAllRoomPhotos);
router.post("/delete-room-photos", deleteRoomPhotos);
router.post("/delete-hotel-photos", deleteHotelPhotos);
router.post("/add-room-photos", upload.array("images", 30), addRoomPhotos);
router.post("/add-hotel-photos", upload.array("images", 30), addHotelPhotos);

// Routes for room inventory
router.post("/get-room-inventory", getRoomInventory);
router.post("/update-room-inventory", updateRoomInventory);

module.exports = router;
