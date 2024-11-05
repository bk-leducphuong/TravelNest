const express = require('express');
const router = express.Router();

// Route to fetch available room for specific hotel
router.get('/hotels/:hotelId/rooms');
// Route to fetch detailed information about specific room
router.get('/rooms/:roomId');



module.exports = router;