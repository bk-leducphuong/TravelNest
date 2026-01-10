const express = require('express');
const router = express.Router();
const {
  checkAuth,
  checkEmail,
  login,
  logout,
  register,
  loginGoogle,
  googleCallback,
  forgotPassword,
  resetPassword,
  loginAdmin,
  registerAdmin,
  sendSmsOtp,
  verifySmsOtp,
} = require('../controllers/auth.controller');
const passport = require('passport');
const validate = require('../middlewares/validate.middleware');
const authSchema = require('../validators/auth.schema');

/**
 * Auth Routes - RESTful API endpoints
 * Following RESTful API standards
 */

// Session resource
// GET /api/auth/session - Check authentication status
router.get('/session', validate(authSchema.checkAuth), checkAuth);

// POST /api/auth/sessions - Login (create session)
router.post('/sessions', validate(authSchema.login), login);

// DELETE /api/auth/sessions - Logout (destroy session)
router.delete('/sessions', validate(authSchema.logout), logout);

// Email resource
// POST /api/auth/email/check - Check if email exists
router.post('/email/check', validate(authSchema.checkEmail), checkEmail);

// User resource
// POST /api/auth/users - Register new user
router.post('/users', validate(authSchema.register), register);

// Password resource
// POST /api/auth/password/forgot - Request password reset OTP
router.post(
  '/password/forgot',
  validate(authSchema.forgotPassword),
  forgotPassword
);

// POST /api/auth/password/reset - Reset password with OTP
router.post(
  '/password/reset',
  validate(authSchema.resetPassword),
  resetPassword
);

// Google OAuth
// GET /api/auth/google - Google OAuth redirect
router.get('/google', validate(authSchema.loginGoogle), loginGoogle);

// GET /api/auth/google/callback - Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/google' }),
  validate(authSchema.googleCallback),
  googleCallback
);

// Admin/Partner resources
// POST /api/auth/admin/sessions - Admin login
router.post('/admin/sessions', validate(authSchema.loginAdmin), loginAdmin);

// POST /api/auth/admin/users - Admin/Partner registration
router.post('/admin/users', validate(authSchema.registerAdmin), registerAdmin);

// OTP resource
// POST /api/auth/otp/sms - Send SMS OTP
router.post('/otp/sms', validate(authSchema.sendSmsOtp), sendSmsOtp);

// POST /api/auth/otp/verify - Verify SMS OTP
router.post('/otp/verify', validate(authSchema.verifySmsOtp), verifySmsOtp);

module.exports = router;
