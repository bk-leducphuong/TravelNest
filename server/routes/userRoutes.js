const express = require('express');
const {isUserAuthenticated} = require('../middlewares/sessionAuth');
const router = express.Router();

router.use(isUserAuthenticated);
router.get('/users/me', );
router.post('/users/me', );

module.exports = router;