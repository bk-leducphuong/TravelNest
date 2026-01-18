const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const redisClient = require('../config/redis.config');
const transporter = require('../config/nodemailer.config');
const fs = require('fs');
const path = require('path');
const authRepository = require('../repositories/auth.repository');
const ApiError = require('../utils/ApiError');
const {
  isValidEmailFormat,
  validateEmail,
  validateEmailDomain,
} = require('../utils/emailValidation.js');
const { Infobip, AuthType } = require('@infobip-api/sdk');

/**
 * Auth Service - Contains main business logic for authentication
 * Follows RESTful API standards
 */

class AuthService {
  /**
   * Check if email exists
   * @param {string} email - Email address
   * @param {string} userRole - User role (customer, partner, admin)
   * @returns {Promise<Object>} Object with exists flag
   */
  async checkEmail(email, userRole) {
    // Validate email format
    if (!isValidEmailFormat(email)) {
      throw new ApiError(400, 'INVALID_EMAIL_FORMAT', 'Invalid email format');
    }

    // Validate email domain
    if (!(await validateEmailDomain(email))) {
      throw new ApiError(400, 'INVALID_EMAIL_DOMAIN', 'Invalid email domain');
    }

    // Check if user exists
    const user = await authRepository.findByEmailAndRole(email, userRole);

    if (user) {
      return { exists: true };
    }

    // Validate active email
    if (!(await validateEmail(email))) {
      throw new ApiError(400, 'EMAIL_NOT_EXISTS', 'Email does not exist');
    }

    return { exists: false };
  }

  /**
   * Login user
   * @param {string} email - Email address
   * @param {string} password - Password
   * @param {string} userRole - User role
   * @returns {Promise<Object>} User data for session
   */
  async login(email, password, userRole) {
    const user = await authRepository.findByEmailAndRoleWithPassword(
      email,
      userRole
    );

    if (!user) {
      throw new ApiError(
        401,
        'INVALID_CREDENTIALS',
        'Invalid email or password'
      );
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new ApiError(
        401,
        'INVALID_CREDENTIALS',
        'Invalid email or password'
      );
    }

    return {
      userId: user.id,
      userRole: user.user_role,
    };
  }

  /**
   * Register new user
   * @param {string} email - Email address
   * @param {string} password - Password
   * @param {string} userRole - User role
   * @returns {Promise<Object>} Created user data
   */
  async register(email, password, userRole) {
    // Check if user already exists
    const existingUser = await authRepository.findByEmailAndRole(
      email,
      userRole
    );

    if (existingUser) {
      throw new ApiError(409, 'USER_ALREADY_EXISTS', 'User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await authRepository.createUser({
      email: email,
      username: email.split('@')[0],
      password_hash: hashedPassword,
      user_role: userRole,
      profile_picture_url:
        'http://localhost:3000/uploads/users/avatars/default_avatar.png',
    });

    return {
      userId: newUser.id,
      userRole: userRole,
    };
  }

  /**
   * Register admin/partner
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Created user data
   */
  async registerAdmin(userData) {
    const { email, password, userRole, firstName, lastName, phoneNumber } =
      userData;

    // Check if user already exists (by email or phone)
    const existingUser = await authRepository.findByEmailOrPhoneAndRole(
      email,
      phoneNumber,
      userRole
    );

    if (existingUser) {
      throw new ApiError(409, 'USER_ALREADY_EXISTS', 'User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const username = `${lastName} ${firstName}`;

    // Create user
    const newUser = await authRepository.createUser({
      email: email,
      username: username,
      password_hash: hashedPassword,
      user_role: userRole,
      phone_number: phoneNumber,
      profile_picture_url:
        'http://localhost:3000/uploads/users/avatars/default_avatar.png',
    });

    return {
      userId: newUser.id,
      userRole: userRole,
    };
  }

  /**
   * Send SMS OTP
   * @param {string} phoneNumber - Phone number
   * @param {string} userRole - User role
   * @returns {Promise<void>}
   */
  async sendSmsOtp(phoneNumber, userRole) {
    // Check rate limiting
    const attemptsKey = `sms-otp-attempts:${phoneNumber}:${userRole}`;
    const attempts = parseInt(await redisClient.get(attemptsKey)) || 0;

    if (attempts >= 3) {
      throw new ApiError(
        429,
        'TOO_MANY_REQUESTS',
        'You have requested too many times. Please try again after 5 minutes.'
      );
    }

    // Increment attempts
    await redisClient.set(attemptsKey, attempts + 1, 'EX', 300);

    // Initialize Infobip
    const infobip = new Infobip({
      apiKey: process.env.INFOBIP_API_KEY,
      baseUrl: process.env.INFOBIP_BASE_URL,
      authType: AuthType.ApiKey,
    });

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000);
    const message = `Your OTP is ${otp}. It expires in 10 minutes.`;

    // Send SMS
    await infobip.channels.sms.send({
      messages: [
        {
          from: '447491163443',
          destinations: [
            {
              to: phoneNumber,
            },
          ],
          text: message,
        },
      ],
    });

    // Store OTP in Redis
    await redisClient.set(`sms-otp:${phoneNumber}`, otp, 'EX', 600);

    return;
  }

  /**
   * Verify SMS OTP
   * @param {string} phoneNumber - Phone number
   * @param {string} otp - OTP code
   * @returns {Promise<void>}
   */
  async verifySmsOtp(phoneNumber, otp) {
    const storedOtp = await redisClient.get(`sms-otp:${phoneNumber}`);

    if (!storedOtp || storedOtp !== otp) {
      throw new ApiError(400, 'INVALID_OTP', 'Invalid OTP');
    }

    // Remove OTP from Redis
    await redisClient.del(`sms-otp:${phoneNumber}`);

    return;
  }

  /**
   * Forgot password - Send OTP via email
   * @param {string} email - Email address
   * @param {string} userRole - User role
   * @returns {Promise<void>}
   */
  async forgotPassword(email, userRole) {
    // Check if user exists
    const user = await authRepository.findByEmailAndRole(email, userRole);
    if (!user) {
      throw new ApiError(404, 'USER_NOT_FOUND', 'Invalid email or role');
    }

    // Check rate limiting
    const attemptsKey = `otp_attempts:${email}:${userRole}`;
    const attempts = parseInt(await redisClient.get(attemptsKey)) || 0;

    if (attempts >= 3) {
      throw new ApiError(
        429,
        'TOO_MANY_REQUESTS',
        'You have requested too many times. Please try again after 5 minutes.'
      );
    }

    // Increment attempts
    await redisClient.set(attemptsKey, attempts + 1, 'EX', 300);

    // Generate OTP
    const otp = crypto.randomInt(1000, 9999).toString();

    // Store OTP in Redis
    const otpKey = `otp:${email}:${userRole}`;
    await redisClient.set(otpKey, otp, 'EX', 300);

    // Load email template
    const templatePath = path.join(
      __dirname,
      '../email-templates/otpVerification.html'
    );
    let emailTemplate = fs.readFileSync(templatePath, 'utf8');

    // Replace placeholders
    emailTemplate = emailTemplate.replace('{{otp}}', otp);

    // Send email
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: 'OTP verification',
      html: emailTemplate,
    };

    await transporter.sendMail(mailOptions);

    return;
  }

  /**
   * Reset password with OTP
   * @param {string} email - Email address
   * @param {string} userRole - User role
   * @param {string} otp - OTP code
   * @param {string} newPassword - New password
   * @returns {Promise<void>}
   */
  async resetPassword(email, userRole, otp, newPassword) {
    // Verify OTP
    const otpKey = `otp:${email}:${userRole}`;
    const storedOtp = await redisClient.get(otpKey);

    if (!storedOtp || storedOtp !== otp) {
      throw new ApiError(400, 'INVALID_OTP', 'Invalid or expired OTP');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    const updatedRows = await authRepository.updatePasswordByEmailAndRole(
      email,
      userRole,
      hashedPassword
    );

    if (updatedRows === 0) {
      throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
    }

    // Remove OTP from Redis
    await redisClient.del(otpKey);

    return;
  }

  /**
   * Handle Google OAuth callback
   * @param {Object} profile - Google profile
   * @returns {Promise<Object>} User data for session
   */
  async handleGoogleCallback(profile) {
    if (!profile) {
      throw new ApiError(401, 'OAUTH_FAILED', 'Google authentication failed');
    }

    const email = profile.emails[0].value;
    const displayName = profile.displayName;

    // Find or create user
    let user = await authRepository.findByEmailAndRole(email, 'customer');

    if (!user) {
      user = await authRepository.createUser({
        email: email,
        username: displayName,
        user_role: 'customer',
        profile_picture_url:
          'http://localhost:3000/uploads/users/avatars/default_avatar.png',
      });
    }

    return {
      userId: user.id,
      userRole: user.user_role,
    };
  }
}

module.exports = new AuthService();
