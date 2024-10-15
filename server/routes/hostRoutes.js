const express = require('express');
const router = express.Router();
const { postAddress, postBedroom, postBreakfast, postFacilities, postHouseRules, postLanguages, postMap, postName, postParking, postPhotos } = require('../controllers/hostController');

// Check email
router.post('/address', postAddress);
// Login route
router.post('/map', postMap);
// register route
router.post('/name', postName);
// Logout route
router.post('/facilities', postFacilities);
//
router.post('/breakfast', postBreakfast);
// 
router.post('/parking', postParking);
// 
router.post('languages', postLanguages);
// 
router.post('/house-rules', postHouseRules);
// 
router.post('/bedroom', postBedroom);
//
router.post('/photos', postPhotos);

module.exports = router;
