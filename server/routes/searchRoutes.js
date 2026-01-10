const express = require('express');
const router = express.Router();
const {
  getSearchResults,
  saveSearchInformation,
} = require('../controllers/searchController');

// root route: /api/search
router.post('/', getSearchResults);

router.post('/save-search-information', saveSearchInformation);
module.exports = router;
