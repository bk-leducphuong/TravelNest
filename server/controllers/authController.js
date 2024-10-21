const connection = require('../config/db');
const bcrypt = require('bcryptjs')
const { promisify } = require('util');
const passport = require('passport');

// Promisify MySQL connection.query method
const queryAsync = promisify(connection.query).bind(connection);

// Check email
const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ error: true, message: 'Please provide a valid email' });
    }

    // Query the database to find the user
    const query = 'SELECT * FROM users WHERE email = ?';
    const results = await queryAsync(query, [email]);

    if (results.length > 0) {
      // Email exists
      return res.status(200).json({ exists: true, message: 'Email is already registered' });
    } else {
      // Email does not exist
      return res.status(200).json({ exists: false, message: 'Email is not available' });
    }

  } catch (error) {
    console.error('Error checking email:', error);
    return res.status(500).json({ error: true, message: 'Internal server error' });
  }
};

// Login function using MySQL
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Query the database to find the user
    const query = 'SELECT * FROM users WHERE email = ?';
    const results = await queryAsync(query, [email]);

    if (results.length === 0) {
      // User not found
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = results[0];

    // Compare provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Create session if password matches
    req.session.user = {
      id: user.user_id
    };

    // Respond with success message
    res.json({ success: true, message: 'Logged in successfully' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// register new user
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUserQuery = 'SELECT * FROM users WHERE email = ?';
    const existingUser = await queryAsync(existingUserQuery, [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const insertQuery = 'INSERT INTO users (email, password_hash) VALUES (?, ?)';
    const result = await queryAsync(insertQuery, [email, hashedPassword]);

    // Create session with user ID from the insert result
    req.session.user = {
      id: result.insertId,  // Get the user ID from the result of the insert query
    };

    // Send success response
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// logout user
const logoutUser = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.status(200).json({ message: 'Logout successful' });
  });
}

const loginGoogle = passport.authenticate('google', { scope: ['profile', 'email'] });
// Callback route sau khi Google xác thực thành công
const googleCallback = async (req, res) => {
  try {
    // Kiểm tra nếu profile của Google trả về không có user
    if (!req.user) {
      return res.status(401).json({ message: 'Đăng nhập thất bại!' });
    }

    const profile = req.user;
    const email = profile.emails[0].value;
    console.log(email);
    const displayName = profile.displayName;
   

    // Tìm người dùng trong cơ sở dữ liệu dựa trên email
    const existingUserQuery = 'SELECT * FROM users WHERE email = ?';
    const existingUser = await queryAsync(existingUserQuery, [email]);

    let userId;

    if (existingUser.length > 0) {
      // Nếu người dùng đã tồn tại
      userId = existingUser[0].user_id;
    } else {
      // Nếu người dùng chưa tồn tại, tạo người dùng mới
      const insertQuery = 'INSERT INTO users ( email,username) VALUES (?, ?)';
      const result = await queryAsync(insertQuery, [ email,displayName]);
      userId = result.insertId;
    }

    // Tạo session cho người dùng
    req.session.user = {
      id: userId
    };

    // Gửi phản hồi thành công
    res.status(200).json({ success: true, message: 'Đăng nhập Google thành công!' });
  } catch (error) {
    console.error('Error during Google login callback:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
module.exports = { checkEmail, loginUser, registerUser, logoutUser, loginGoogle, googleCallback };

