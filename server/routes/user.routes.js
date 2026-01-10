const express = require("express");
const { isUserAuthenticated } = require("../middlewares/sessionAuth");
const {
  getUserInformation,
  editName,
  editDisplayName,
  editEmail,
  editPhoneNumber,
  editDateOfBirth,
  editAddress,
  editNationality,
  editCountry,
  editGender,
  editAvatar,
  getFavoriteHotels,
  setFavoriteHotels,
  deleteFavoriteHotel,
  checkFavoriteHotel,
  resetPassword,
} = require("../controllers/user.controller.js");
const upload = require("../config/multer");
const router = express.Router();

// root route: /api/user
router.use(isUserAuthenticated);

// User information routes
router.get("/get-user-information", getUserInformation);
router.post("/edit-name", editName);
router.post("/edit-display-name", editDisplayName);
router.post("/edit-email", editEmail);
router.post("/edit-phone-number", editPhoneNumber);
router.post("/edit-date-of-birth", editDateOfBirth);
router.post("/edit-address", editAddress);
router.post("/edit-nationality", editNationality);
router.post("/edit-country", editCountry);
router.post("/edit-gender", editGender);
router.post("/edit-avatar", upload.single("avatar"), editAvatar);
router.post("/reset-password", resetPassword);

// Favorite hotels routes
router.get("/favorite-hotels/get-favorite-hotels", getFavoriteHotels);
router.post("/favorite-hotels/set-favorite-hotel", setFavoriteHotels);
router.post("/favorite-hotels/delete-favorite-hotel", deleteFavoriteHotel);
router.post("/favorite-hotels/check-favorite-hotel", checkFavoriteHotel);

module.exports = router;
