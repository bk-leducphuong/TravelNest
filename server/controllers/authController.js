const connection = require("../config/db");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const passport = require("passport");
const crypto = require("crypto");
const redisClient = require("../config/redis");
const nodemailer = require("nodemailer"); // Dùng để gửi email
const transporter = require("../config/nodemailer");
const fs = require('fs')

require("dotenv").config();
const { Infobip, AuthType } = require("@infobip-api/sdk");

const {
  isValidEmailFormat,
  validateEmail,
  validateEmailDomain,
} = require("../utils/emailValidation.js");

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

/******************************* For customer ***************************/
// Check authentication
const checkAuth = (req, res) => {
  try {
    if (req.session.user && req.session.user.user_id) {
      if (req.session.user.userRole === "customer") {
        return res.status(200).json({
          isAuthenticated: true,
          userId: req.session.user.user_id,
          userRole: req.session.user.userRole,
        });
      } else if (req.session.user.userRole === "partner") {
        return res.status(200).json({
          isAuthenticated: true,
          userId: req.session.user.user_id,
          userRole: req.session.user.userRole,
        });
      }
    } else {
      return res.status(200).json({ isAuthenticated: false });
    }
  } catch (error) {
    console.error("Error in checkAuth:", error);
    res
      .status(500)
      .json({ isAuthenticated: false, error: "Internal server error" });
  }
};

// Check email
const checkEmail = async (req, res) => {
  try {
    const { email, userRole } = req.body;

    // Validate input
    if (!email) {
      return res
        .status(400)
        .json({ error: true, message: "Please provide a valid email" });
    }

    // Validate email format
    if (!isValidEmailFormat(email)) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid email format" });
    }
    // Validate email domain
    if (!(await validateEmailDomain(email))) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid email domain" });
    }

    // Query the database to find the user
    const query = "SELECT * FROM users WHERE email = ? AND user_role = ?";
    const results = await queryAsync(query, [email, userRole]);

    if (results.length > 0) {
      // Email exists then show login page
      return res.status(200).json({ exists: true });
    } else {
      // Email does not exist then show register page

      // Validate active email
      if (!(await validateEmail(email))) {
        return res
          .status(400)
          .json({ error: true, message: "Email dont exist" });
      }

      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking email:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

// Login function using MySQL
const loginUser = async (req, res) => {
  try {
    const { email, password, userRole } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email and password" });
    }

    // Query the database to find the user
    const query = "SELECT * FROM users WHERE email = ? AND user_role = ?";
    const results = await queryAsync(query, [email, userRole]);

    if (results.length === 0) {
      // User not found
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const user = results[0];

    // Compare provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Create session if password matches
    req.session.user = {
      user_id: user.user_id,
      userRole: user.user_role,
    };

    // Respond with success message
    res.json({
      success: true,
      userId: user.user_id,
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// register new user
const registerUser = async (req, res) => {
  try {
    const { email, password, userRole } = req.body;

    // Check if user already exists
    const existingUserQuery =
      "SELECT * FROM users WHERE email = ? AND user_role = ?";
    const existingUser = await queryAsync(existingUserQuery, [email, userRole]);

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const insertQuery =
      "INSERT INTO users (email, username, password_hash, user_role, profile_picture_url) VALUES (?, ?, ?, ?, ?)";
    const result = await queryAsync(insertQuery, [
      email,
      email.split("@")[0],
      hashedPassword,
      userRole,
      "http://localhost:3000/uploads/users/avatars/default_avatar.png", // default avatar
    ]);

    // Create session with user ID from the insert result
    req.session.user = {
      user_id: result.insertId, // Get the user ID from the result of the insert query
      userRole: userRole,
    };

    // Send success response
    res.status(201).json({
      success: true,
      userId: result.insertId,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// logout user
const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    res.status(200).json({ message: "Logout successful" });
  });
};

const loginGoogle = passport.authenticate("google", {
  scope: ["profile", "email"],
});
// Callback route sau khi Google xác thực thành công
const googleCallback = async (req, res) => {
  try {
    // Kiểm tra nếu profile của Google trả về không có user
    if (!req.user) {
      return res.status(401).json({ message: "Đăng nhập thất bại!" });
    }

    const profile = req.user;
    const email = profile.emails[0].value;
    // console.log(email);
    const displayName = profile.displayName;

    // Tìm người dùng trong cơ sở dữ liệu dựa trên email
    const existingUserQuery =
      "SELECT * FROM users WHERE email = ? AND user_role = ?";
    const existingUser = await queryAsync(existingUserQuery, [
      email,
      "customer",
    ]);

    let userId;

    if (existingUser.length > 0) {
      // Nếu người dùng đã tồn tại
      userId = existingUser[0].user_id;
    } else {
      // Nếu người dùng chưa tồn tại, tạo người dùng mới
      const insertQuery =
        "INSERT INTO users ( email,username, user_role, profile_picture_url) VALUES (?, ?, ?, ?)";
      const result = await queryAsync(insertQuery, [
        email,
        displayName,
        "customer",
        "http://localhost:3000/uploads/users/avatars/default_avatar.png", // default avatar
      ]);
      userId = result.insertId;
    }

    // Tạo session cho người dùng
    req.session.user = {
      user_id: userId,
    };

    // Gửi phản hồi thành công
    res
      .status(200)
      .json({ success: true, message: "Đăng nhập Google thành công!" });
  } catch (error) {
    console.error("Error during Google login callback:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/******************************* For partner/admin ***************************/
const loginAdmin = async (req, res) => {
  try {
    const { email, password, userRole } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email and password" });
    }

    // Query the database to find the user
    const query = "SELECT * FROM users WHERE email = ? AND user_role = ?";
    const results = await queryAsync(query, [email, userRole]);

    if (results.length === 0) {
      // User not found
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const user = results[0];

    // Compare provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Create session if password matches
    req.session.user = {
      user_id: user.user_id,
      userRole: user.user_role,
    };

    // Respond with success message
    res.json({
      success: true,
      userId: user.user_id,
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const registerAdmin = async (req, res) => {
  try {
    const { email, password, userRole, firstName, lastName, phoneNumber } =
      req.body;

    // Check if user already exists
    const existingUserQuery =
      "SELECT * FROM users WHERE email = ? AND user_role = ? AND phone_number = ?";
    const existingUser = await queryAsync(existingUserQuery, [
      email,
      userRole,
      phoneNumber,
    ]);

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const username = lastName + " " + firstName;
    // Insert new user into the database
    const insertQuery =
      "INSERT INTO users (email, username, password_hash, user_role, phone_number, profile_picture_url) VALUES (?, ? , ?, ?, ?, ?)";
    const result = await queryAsync(insertQuery, [
      email,
      username,
      hashedPassword,
      userRole,
      phoneNumber,
      "http://localhost:3000/uploads/users/avatars/default_avatar.png", // default avatar
    ]);

    // Create session with user ID from the insert result
    req.session.user = {
      user_id: result.insertId, // Get the user ID from the result of the insert query
      userRole: userRole,
    };

    // Send success response
    res.status(201).json({
      success: true,
      userId: result.insertId,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const sendSmsOtp = async (req, res) => {
  try {
    const { phoneNumber, userRole } = req.body;
    if (!phoneNumber) {
      res.status(400).json({ success: false, message: "Missing phone number" });
    }

     // Giới hạn số lần gửi OTP
    const attemptsKey = `sms-otp-attempts:${phoneNumber}:${userRole}`;
    const attempts = parseInt(await redisClient.get(attemptsKey)) || 0;

    if (attempts >= 3) {
      return res.status(429).json({
        success: false,
        message: "Bạn đã yêu cầu quá nhiều lần. Hãy thử lại sau 5 phút.",
      });
    }

    // Tăng số lần gửi OTP và đặt thời gian hết hạn
    await redisClient.set(attemptsKey, parseInt(attempts) + 1, "EX", 300);

    let inforbip = new Infobip({
      apiKey: process.env.INFOBIP_API_KEY,
      baseUrl: process.env.INFOBIP_BASE_URL,
      authType: AuthType.ApiKey,
    });

    const otp = Math.floor(1000 + Math.random() * 9000); // Generate a random 6-digit OTP
    const message = `Your OTP is ${otp}. It expires in 10 minutes.`;

    const response = await inforbip.channels.sms.send({
      messages: [
        {
          from: "447491163443", // Sender ID (set this in your Infobip account)
          destinations: [
            {
              to: phoneNumber,
            },
          ],
          text: message,
        },
      ],
    });

    // Store the OTP in Redis
    await redisClient.set(`sms-otp:${phoneNumber}`, otp, `EX`, 600); // Set OTP expiration time to 10 minutes
    
    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending SMS:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Error sending SMS" });
  }
};

const verifySmsOtp = async (req, res) => {
  try {
    const {phoneNumber, otp} = req.body;

    const otpFromRedis = await redisClient.get(`sms-otp:${phoneNumber}`);
    if (otpFromRedis === otp) {
      // Remove the OTP from Redis
      await redisClient.del(`sms-otp:${phoneNumber}`);
      res.status(200).json({ success: true, message: "OTP verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error(
      "Error verifying OTP:",
      error.response?.data || error.message
    );
    res.status(500).json({ success: false, message: "Error verifying OTP" });
  }
};

//****************************Forgot Password Functions ******************************

const forgotPassword = async (req, res) => {
  const { email, userRole } = req.body;

  try {
    // Kiểm tra email và userRole có tồn tại
    const [user] = await queryAsync(
      "SELECT user_id FROM users WHERE email = ? AND user_role = ?",
      [email, userRole]
    );
    if (!user) {
      return res
        .status(404)
        .json({ message: "Email hoặc vai trò không hợp lệ" });
    }

    // Giới hạn số lần gửi OTP
    const attemptsKey = `otp_attempts:${email}:${userRole}`;
    const attempts = parseInt(await redisClient.get(attemptsKey)) || 0;

    if (attempts >= 3) {
      return res.status(429).json({
        message: "Bạn đã yêu cầu quá nhiều lần. Hãy thử lại sau 5 phút.",
      });
    }

    // Tăng số lần gửi OTP và đặt thời gian hết hạn
    await redisClient.set(attemptsKey, parseInt(attempts) + 1, "EX", 300);

    // Tạo OTP (6 chữ số)
    const otp = crypto.randomInt(1000, 9999).toString();

    // Lưu OTP vào Redis với thời gian hết hạn (5 phút)
    const otpKey = `otp:${email}:${userRole}`;
    await redisClient.set(otpKey, otp, "EX", 300);

     // Load the email template
    const templatePath = "./email-templates/otpVerification.html";
    let emailTemplate = fs.readFileSync(templatePath, "utf8");

    // Replace placeholders with actual booking details
    emailTemplate = emailTemplate
      .replace("{{otp}}", otp)

    // Email options
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email, // Recipient's email address
      subject: "OTP verification",
      html: emailTemplate, // HTML content
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP đã được gửi đến email của bạn" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const resetPassword = async (req, res) => {
  const { email, userRole, otp, newPassword } = req.body;

  try {
    // Lấy OTP từ Redis
    const otpKey = `otp:${email}:${userRole}`;
    const storedOtp = await redisClient.get(otpKey);
    if (!storedOtp || storedOtp !== otp) {
      return res
        .status(400)
        .json({ message: "OTP không hợp lệ hoặc đã hết hạn" });
    }

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu mới trong database
    await queryAsync(
      "UPDATE users SET password_hash = ? WHERE email = ? AND user_role = ?",
      [hashedPassword, email, userRole]
    );

    // Xóa OTP khỏi Redis
    await redisClient.del(otpKey);

    res.status(200).json({ message: "Mật khẩu đã được cập nhật thành công!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  checkEmail,
  loginUser,
  registerUser,
  logoutUser,
  loginGoogle,
  googleCallback,
  checkAuth,

  loginAdmin,
  registerAdmin,
  sendSmsOtp,
  verifySmsOtp,
  forgotPassword,
  resetPassword,
};
