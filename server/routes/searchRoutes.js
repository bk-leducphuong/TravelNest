const express = require('express');
const router = express.Router();
const { getSearchResults } = require('../controllers/searchController');

router.post('/', getSearchResults);

module.exports = router;