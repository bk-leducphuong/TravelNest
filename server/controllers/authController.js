const connection = require("../config/db");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const passport = require("passport");

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
      return res.status(200).json({ isAuthenticated: true });
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
      return res
        .status(200)
        .json({ exists: true });
    } else {
      // Email does not exist then show register page

      // Validate active email
      if (!(await validateEmail(email))) {
        return res
          .status(400)
          .json({ error: true, message: "Email dont exist" });
      }

      return res
        .status(200)
        .json({ exists: false });
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
    };

    // Respond with success message
    res.json({ success: true, message: "Logged in successfully" });
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
      "INSERT INTO users (email, username, password_hash, user_role) VALUES (?, ?, ?, ?)";
    const result = await queryAsync(insertQuery, [
      email,
      email.split("@")[0],
      hashedPassword,
      userRole,
    ]);

    // Create session with user ID from the insert result
    req.session.user = {
      user_id: result.insertId, // Get the user ID from the result of the insert query
    };

    // Send success response
    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
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
        "INSERT INTO users ( email,username, user_role) VALUES (?, ?, ?)";
      const result = await queryAsync(insertQuery, [
        email,
        displayName,
        "customer",
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
    };

    // Respond with success message
    res.json({ success: true, message: "Logged in successfully" });
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
      "SELECT * FROM users WHERE email = ? AND user_role = ?";
    const existingUser = await queryAsync(existingUserQuery, [email, userRole]);

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
      "INSERT INTO users (email, username, password_hash, user_role, phone_number) VALUES (?, ? , ?, ?, ?)";
    const result = await queryAsync(insertQuery, [
      email,
      username,
      hashedPassword,
      userRole,
      phoneNumber,
    ]);

    // Create session with user ID from the insert result
    req.session.user = {
      user_id: result.insertId, // Get the user ID from the result of the insert query
    };

    // Send success response
    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
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
};
