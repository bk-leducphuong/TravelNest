const nodemailer = require('nodemailer')
require('dotenv').config();  // Tải các biến môi trường từ file .env

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Sử dụng Gmail SMTP server
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD
  }
});

module.exports = transporter