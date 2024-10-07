const connection = require('../config/db');
const bcrypt = require('bcryptjs')

// Login function using MySQL
const loginUser = (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  // Query the database to find the user
  const query = 'SELECT * FROM users WHERE email = ?';
  
  connection.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length > 0) { // if email is valid
      // Check if password matches
      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
      }

      // Create session if password is true
      req.session.user = {
        id: results[0].user_id
      };

      res.json({ message: 'Login successful' });

    } else {
      // User not found, return error
      res.status(401).json({ message: 'Invalid email or password' });
    }
  });
};

// register new user
const registerUser = async (req, res) => {
  const { email, password } = req.body;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save into database
  const query = 'INSERT INTO users(email, password_hash) VALUES (?, ?)';
  connection.query(query, [email, hashedPassword], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
  });

  res.json({ message: 'User registered successfully' });
}

// logout user
const logoutUser = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.json({ message: 'Logout successful' });
  });
}

module.exports = { loginUser, registerUser, logoutUser };

