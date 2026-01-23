const hotelService = require('@services/image.service');
const logger = require('@config/logger.config');
const asyncHandler = require('@utils/asyncHandler');

const uploadImage = asyncHandler(async (req, res) => {
  // TODO: call uploadImage service
});

const getImages = asyncHandler(async (req, res) => {
  // TODO: call getImages service
});

const deleteImage = asyncHandler(async (req, res) => {
  // TODO: call deleteImage service
});

module.exports = {
  uploadImage,
  getImages,
  deleteImage,
};
