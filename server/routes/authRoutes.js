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

module.exports = router;
