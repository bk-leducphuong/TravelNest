const express = require('express');
const bodyParser = require('body-parser');
const { createAccount, createPayout, createAccountLink, checkAccountExist } = require('../../controllers/admin/payoutController');
const { isAdminAuthenticated } = require('../../middlewares/sessionAuth');
const router = express.Router();

// root route: /api/admin/payment

router.use(isAdminAuthenticated);
//Route to check if user already has an account
router.get('/check-account-exist', checkAccountExist);
// Route to create connect account link
router.post('/create-account-link', createAccountLink)
// Route to create connect account for owner
router.post('/create-connect-account', createAccount );
// Route to create payout
router.post('/create-payout', createPayout);

module.exports = router;