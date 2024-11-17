const express = require('express');
const {isAdminAuthenticated} = require('../middlewares/sessionAuth');
const upload = require('../config/multer');
const router = express.Router();
const { postJoinFormData, postPhotos } = require('../controllers/joinController');

// Apply the isAuthenticated middleware to all routes under /api/join/
router.use(isAdminAuthenticated);

// Route for storing join form data
router.post('/', postJoinFormData);

// post hotel photos
router.post('/upload-photos',upload.array('images', 30), postPhotos);

module.exports = router;
