const connection = require('../config/db');

// Login function using MySQL
const loginUser = (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  // Query the database to find the user
  const query = 'SELECT * FROM users WHERE email = ? AND password_hash = ?';
  
  connection.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length > 0) {
      // User found, return success response
      res.status(200).json({
        message: 'Login successful',
        user: { email: results[0].email },
      });
    } else {
      // User not found, return error
      res.status(401).json({ message: 'Invalid email or password' });
    }
  });
};

module.exports = { loginUser };

