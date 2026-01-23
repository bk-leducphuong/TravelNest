const express = require('express');
const router = express.Router();
const {
  uploadImage,
  getImages,
  deleteImage,
  setPrimaryImage,
} = require('@controllers/v1/image.controller');
const upload = require('@config/multer.config');

// Root route: /api/v1/images

/**
 * GET /api/v1/images/:entityType/:entityId
 * Get all images for an entity (hotel, room, review, user_avatar)
 */
router.get('/:entityType/:entityId', getImages);

/**
 * POST /api/v1/images/:entityType/:entityId
 * Upload an image for an entity
 * Body (multipart/form-data):
 *   - file: image file
 *   - is_primary: boolean (optional)
 */
router.post('/:entityType/:entityId', upload.single('file'), uploadImage);

/**
 * PUT /api/v1/images/:entityType/:entityId/primary/:imageId
 * Set an image as primary for an entity
 */
router.put('/:entityType/:entityId/primary/:imageId', setPrimaryImage);

/**
 * DELETE /api/v1/images/:id
 * Delete an image (soft delete)
 */
router.delete('/:id', deleteImage);

module.exports = router;
