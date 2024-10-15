const express = require('express');
const isAuthenticated = require('../middlewares/sessionAuth')
const upload = require('../config/multer');
const router = express.Router();
const { postAddress, postBedroom, postBreakfast, postFacilities, postHouseRules, postLanguages, postMap, postName, postParking, postPhotos } = require('../controllers/hostController');

// Apply the isAuthenticated middleware to all routes under /api/host/
router.use(isAuthenticated);
// post hotel address
router.post('/address', postAddress);
// post hotel map (longitude, latitude)
router.post('/map', postMap);
// post name, star rating of hotel
router.post('/name', postName);
// post hotel facilities 
router.post('/facilities', postFacilities);
// post hotel breakfast
router.post('/breakfast', postBreakfast);
// post hotel parking
router.post('/parking', postParking);
// post hotel languages
router.post('/languages', postLanguages);
// post hotel rules
router.post('/house-rules', postHouseRules);
// post hotel bedroom
router.post('/bedroom', postBedroom);
// post hotel photos
router.post('/photos',upload.array('images', 30), postPhotos);

module.exports = router;
