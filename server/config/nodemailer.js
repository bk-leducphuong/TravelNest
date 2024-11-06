const nodemailer = require('nodemailer')

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: 'localhost:3000',
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD
  }
});

module.exports = transporter