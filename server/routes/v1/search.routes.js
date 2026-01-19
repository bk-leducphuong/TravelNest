const express = require('express');
const {
  searchHotels,
  saveSearchInformation,
} = require('@controllers/v1/search.controller.js');
const validate = require('@middlewares/validate.middleware');
const searchSchema = require('@validators/v1/search.schema');
const router = express.Router();

// root route: /api/search

/**
 * GET /api/search
 * Search hotels by location and availability
 * Query params: location, adults, children, checkInDate, checkOutDate, rooms, numberOfDays
 */
router.get('/', validate(searchSchema.searchHotels), searchHotels);

/**
 * POST /api/search
 * Save search information to search logs
 */
router.post(
  '/',
  validate(searchSchema.saveSearchInformation),
  saveSearchInformation
);

module.exports = router;
