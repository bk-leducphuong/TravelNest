class ImageService {
  async uploadImage(req, res) {
    const { entityType, entityId } = req.params;
    const file = req.file;
    const isPrimary = req.body.is_primary === 'true';

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate UUID and object key
    const imageUuid = uuidv4();
    const fileExtension = path.extname(file.originalname).substring(1);
    const objectKey = `${entityType}/${entityId}/${imageUuid}.${fileExtension}`;
    const bucket = getBucketName(entityType);

    // Upload to MinIO
    await minioClient.putObject(bucket, objectKey, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });

    // Insert metadata to database
    const result = await query(
      `INSERT INTO images 
       (uuid, entity_type, entity_id, bucket_name, object_key, 
        original_filename, file_size, mime_type, is_primary, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        imageUuid,
        entityType,
        entityId,
        bucket,
        objectKey,
        file.originalname,
        file.size,
        file.mimetype,
        isPrimary,
        'processing',
      ]
    );

    const imageId = result.insertId;

    // Publish to processing queue
    await publishToQueue(
      'image.processing',
      {
        imageId,
        uuid: imageUuid,
        bucket,
        objectKey,
        entityType,
        mimeType: file.mimetype,
      },
      isPrimary ? 10 : 5 // Higher priority for primary images
    );
  }

  async getImages(req, res) {
    const { entityType, entityId } = req.params;

    const images = await query(
      `SELECT uuid, original_filename, file_size, mime_type, width, height,
              is_primary, display_order, status, uploaded_at
       FROM images
       WHERE entity_type = ? AND entity_id = ? AND status = 'active'
       ORDER BY is_primary DESC, display_order ASC`,
      [entityType, entityId]
    );

    // Generate pre-signed URLs for each image
    const imagesWithUrls = await Promise.all(
      images.map(async (img) => {
        const image = await query(
          'SELECT bucket_name, object_key FROM images WHERE uuid = ?',
          [img.uuid]
        );

        const url = await minioClient.presignedGetObject(
          image[0].bucket_name,
          image[0].object_key,
          24 * 60 * 60 // 24 hours
        );

        // Get variants
        const variants = await query(
          `SELECT variant_type, object_key, width, height 
           FROM image_variants 
           WHERE image_id = (SELECT id FROM images WHERE uuid = ?)`,
          [img.uuid]
        );

        const variantUrls = {};
        for (const variant of variants) {
          variantUrls[variant.variant_type] =
            await minioClient.presignedGetObject(
              image[0].bucket_name,
              variant.object_key,
              24 * 60 * 60
            );
        }

        return {
          ...img,
          url,
          variants: variantUrls,
        };
      })
    );
  }

  async deleteImage(req, res) {
    const { uuid } = req.params;

    await query(
      `UPDATE images 
       SET status = 'deleted', deleted_at = NOW() 
       WHERE uuid = ?`,
      [uuid]
    );
  }
}

module.exports = new ImageService();
