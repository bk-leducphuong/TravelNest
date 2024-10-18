const express = require('express');
const router = express.Router();
const { checkEmail, loginUser, registerUser, logoutUser, loginGoogle } = require('../controllers/authController');

// Check email
router.post('/check-email', checkEmail);
// Login route
router.post('/login', loginUser);
// Login with google
router.post('/login-google', loginGoogle);
// register route
router.post('/register', registerUser)
// Logout route
router.post('/logout', logoutUser);


module.exports = router;
