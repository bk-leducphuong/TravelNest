require("dotenv").config();
const { Infobip, AuthType } = require("@infobip-api/sdk");
const redisClient = require("../config/redis");

async function sendOtp(phoneNumber) {
  let inforbip = new Infobip({
    apiKey: process.env.INFOBIP_API_KEY,
    baseUrl: process.env.INFOBIP_BASE_URL,
    authType: AuthType.ApiKey,
  });

  try {
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

    console.log("SMS sent successfully:", response);

    // Store the OTP in Redis
    await redisClient.set(`otp:${phoneNumber}`, otp, `EX`, 600); // Set OTP expiration time to 10 minutes
    return otp;
  } catch (error) {
    console.error("Error sending SMS:", error.response?.data || error.message);
  }
}

async function verifyOtp(phoneNumber, otp) {
  try {
    const otpFromRedis = await redisClient.get(`otp:${phoneNumber}`);
    if (otpFromRedis === otp) {
      // Remove the OTP from Redis
      await redisClient.del(`otp:${phoneNumber}`);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(
      "Error verifying OTP:",
      error.response?.data || error.message
    );
  }
}

module.exports = { sendOtp, verifyOtp };
