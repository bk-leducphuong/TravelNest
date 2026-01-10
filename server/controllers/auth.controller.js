const authService = require('../services/auth.service');
const logger = require('../config/logger');
const asyncHandler = require('../utils/asyncHandler');
const passport = require('passport');
const validate = require('../middlewares/validate.middleware');

/**
 * Auth Controller - HTTP ↔ business mapping
 * Follows RESTful API standards
 */

/**
 * GET /api/auth/session
 * Check authentication status
 */
const checkAuth = asyncHandler(async (req, res) => {
  if (req.session.user && req.session.user.user_id) {
    return res.status(200).json({
      data: {
        isAuthenticated: true,
        userId: req.session.user.user_id,
        userRole: req.session.user.userRole,
      },
    });
  }

  res.status(200).json({
    data: {
      isAuthenticated: false,
    },
  });
});

/**
 * POST /api/auth/email/check
 * Check if email exists
 */
const checkEmail = asyncHandler(async (req, res) => {
  const { email, userRole } = req.body; // Already validated by Joi

  const result = await authService.checkEmail(email, userRole);

  res.status(200).json({
    data: result,
  });
});

/**
 * POST /api/auth/sessions
 * Login (create session)
 */
const login = asyncHandler(async (req, res) => {
  const { email, password, userRole } = req.body; // Already validated by Joi

  const sessionData = await authService.login(email, password, userRole);

  // Create session
  req.session.user = {
    user_id: sessionData.userId,
    userRole: sessionData.userRole,
  };

  res.status(201).json({
    data: {
      userId: sessionData.userId,
      message: 'Logged in successfully',
    },
  });
});

/**
 * DELETE /api/auth/sessions
 * Logout (destroy session)
 */
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      logger.error({ err }, 'Error destroying session');
      return res.status(500).json({
        error: {
          code: 'LOGOUT_FAILED',
          message: 'Logout failed',
        },
      });
    }
    res.clearCookie('connect.sid');
    res.status(204).send();
  });
};

/**
 * POST /api/auth/users
 * Register new user
 */
const register = asyncHandler(async (req, res) => {
  const { email, password, userRole } = req.body; // Already validated by Joi

  const userData = await authService.register(email, password, userRole);

  // Create session
  req.session.user = {
    user_id: userData.userId,
    userRole: userData.userRole,
  };

  res.status(201).json({
    data: {
      userId: userData.userId,
      message: 'User registered successfully',
    },
  });
});

/**
 * GET /api/auth/google
 * Google OAuth redirect
 */
const loginGoogle = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

/**
 * GET /api/auth/google/callback
 * Google OAuth callback
 */
const googleCallback = asyncHandler(async (req, res) => {
  const sessionData = await authService.handleGoogleCallback(req.user);

  // Create session
  req.session.user = {
    user_id: sessionData.userId,
    userRole: sessionData.userRole,
  };

  res.status(200).json({
    data: {
      message: 'Google login successful',
    },
  });
});

/**
 * POST /api/auth/password/forgot
 * Request password reset OTP
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email, userRole } = req.body; // Already validated by Joi

  await authService.forgotPassword(email, userRole);

  res.status(200).json({
    data: {
      message: 'OTP has been sent to your email',
    },
  });
});

/**
 * POST /api/auth/password/reset
 * Reset password with OTP
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { email, userRole, otp, newPassword } = req.body; // Already validated by Joi

  await authService.resetPassword(email, userRole, otp, newPassword);

  res.status(200).json({
    data: {
      message: 'Password has been reset successfully',
    },
  });
});

/**
 * POST /api/auth/admin/sessions
 * Admin login
 */
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password, userRole } = req.body; // Already validated by Joi

  const sessionData = await authService.login(email, password, userRole);

  // Create session
  req.session.user = {
    user_id: sessionData.userId,
    userRole: sessionData.userRole,
  };

  res.status(201).json({
    data: {
      userId: sessionData.userId,
      message: 'Logged in successfully',
    },
  });
});

/**
 * POST /api/auth/admin/users
 * Admin/Partner registration
 */
const registerAdmin = asyncHandler(async (req, res) => {
  const userData = req.body; // Already validated by Joi

  const result = await authService.registerAdmin(userData);

  // Create session
  req.session.user = {
    user_id: result.userId,
    userRole: result.userRole,
  };

  res.status(201).json({
    data: {
      userId: result.userId,
      message: 'User registered successfully',
    },
  });
});

/**
 * POST /api/auth/otp/sms
 * Send SMS OTP
 */
const sendSmsOtp = asyncHandler(async (req, res) => {
  const { phoneNumber, userRole } = req.body; // Already validated by Joi

  await authService.sendSmsOtp(phoneNumber, userRole);

  res.status(200).json({
    data: {
      message: 'OTP sent successfully',
    },
  });
});

/**
 * POST /api/auth/otp/verify
 * Verify SMS OTP
 */
const verifySmsOtp = asyncHandler(async (req, res) => {
  const { phoneNumber, otp } = req.body; // Already validated by Joi

  await authService.verifySmsOtp(phoneNumber, otp);

  res.status(200).json({
    data: {
      message: 'OTP verified successfully',
    },
  });
});

module.exports = {
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
};
