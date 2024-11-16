const express = require("express");
const router = express.Router();
const {
  checkEmail,
  loginUser,
  registerUser,
  logoutUser,
  loginGoogle,
  googleCallback,
  checkAuth,
  loginAdmin,
  registerAdmin,
} = require("../controllers/authController");
const passport = require("passport");

// otp verification
const { sendOtp, verifyOtp } = require("../utils/otpVerification.js");

/********************** For customer *****************/
// Check authentication
router.get("/check-auth", checkAuth);
// Check email
router.post("/check-email", checkEmail);
// Login route
router.post("/login", loginUser);
// Login with google
router.get("/login-google", loginGoogle);
// register route
router.post("/register", registerUser);
// Logout route
router.post("/logout", logoutUser);

// callback route after gg authentication
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login-google" }),
  googleCallback
);

/********************** For partner/admin *******************/
router.post("/admin/login", loginAdmin);
router.post("/admin/register", registerAdmin);

/********************** OTP Verification *******************/
router.post("/send-otp", async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const otp = await sendOtp(phoneNumber);
    res.json({ success: true, otp: otp });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { phoneNumber, otp } = req.body;
  try {
    const isValid = await verifyOtp(phoneNumber, otp);
    if (isValid) {
      res.json({ success: true, message: "OTP verified successfully" });
    } else {
      res.json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
