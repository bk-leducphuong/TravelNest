const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/authController');

// Login route
router.post('/login', loginUser);
// register route
router.post('/register', )
// Logout route
router.post('/logout');

module.exports = router;
