const express = require('express');
const router = express.Router();
const { loginUser, registerUser, logoutUser } = require('../controllers/authController');

// Login route
router.post('/login', loginUser);
// register route
router.post('/register', registerUser)
// Logout route
router.post('/logout', logoutUser);

module.exports = router;
