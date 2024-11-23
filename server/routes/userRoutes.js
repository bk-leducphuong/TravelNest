const express = require('express');
const {isUserAuthenticated} = require('../middlewares/sessionAuth');
const { getUserInformation } = require( '../controllers/userController.js');
const router = express.Router();

// root route: /api/user
router.use(isUserAuthenticated);

router.get('/get-user-information', getUserInformation);
router.post('/users/me', );

module.exports = router;