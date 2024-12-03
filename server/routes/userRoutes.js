const express = require('express');
const {isUserAuthenticated} = require('../middlewares/sessionAuth');
const { getUserInformation, getBookingInformation, editName, editDisplayName, editEmail, editPhoneNumber, editDateOfBirth, editAddress, editNationality, editCountry, editGender, editAvatar } = require( '../controllers/userController.js');
const upload = require('../config/multer');
const router = express.Router();

// root route: /api/user
router.use(isUserAuthenticated);

router.get('/get-user-information', getUserInformation);
// Route to edit user information
router.post('/edit-name', editName);
router.post('/edit-display-name', editDisplayName);
router.post('/edit-email', editEmail);
router.post('/edit-phone-number', editPhoneNumber);
router.post('/edit-date-of-birth', editDateOfBirth);
router.post('/edit-address', editAddress);
router.post('/edit-nationality', editNationality);
router.post('/edit-country', editCountry);
router.post('/edit-gender', editGender);
router.post('/edit-avatar', upload.single('avatar'), editAvatar);

// Route to get booking information of user
router.post('/booking/get-booking-information', getBookingInformation);

module.exports = router;