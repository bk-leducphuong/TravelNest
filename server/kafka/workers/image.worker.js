require('dotenv').config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
});
const { createRetryingConsumer } = require('@kafka/index');
const { minioClient } = require('@config/minio.config');
const sharp = require('sharp');

// Image variant configurations
const IMAGE_VARIANTS = {
  thumbnail: { width: 150, height: 150, quality: 85 },
  small: { width: 400, height: 400, quality: 85 },
  medium: { width: 800, height: 800, quality: 90 },
  large: { width: 1920, height: 1920, quality: 95 },
};

  function processImage(message) {
    const { imageId, bucket, objectKey, mimeType } = message;

    // Download original from MinIO
    const dataStream = await minioClient.getObject(bucket, objectKey);
    const chunks = [];

    for await (const chunk of dataStream) {
      chunks.push(chunk);
    }

    const imageBuffer = Buffer.concat(chunks);

    // Load image with Sharp
    let image = sharp(imageBuffer);

    // Get metadata
    const metadata = await image.metadata();
    const { width, height } = metadata;

    // Update dimensions in database
    await query('UPDATE images SET width = ?, height = ? WHERE id = ?', [
      width,
      height,
      imageId,
    ]);

    // Generate variants
    const variantRecords = [];

    for (const [variantName, config] of Object.entries(IMAGE_VARIANTS)) {
      // Generate JPEG variant
      const jpegKey = objectKey.replace(/\.[^.]+$/, `_${variantName}.jpg`);
      const jpegBuffer = await this.resizeImage(imageBuffer, config, 'jpeg');

      await minioClient.putObject(bucket, jpegKey, jpegBuffer, {
        'Content-Type': 'image/jpeg',
      });

      const jpegMetadata = await sharp(jpegBuffer).metadata();
      variantRecords.push({
        imageId,
        variantType: variantName,
        bucketName: bucket,
        objectKey: jpegKey,
        fileSize: jpegBuffer.length,
        width: jpegMetadata.width,
        height: jpegMetadata.height,
      });

      // Generate WebP variant
      const webpKey = objectKey.replace(/\.[^.]+$/, `_${variantName}.webp`);
      const webpBuffer = await this.resizeImage(imageBuffer, config, 'webp');

      await minioClient.putObject(bucket, webpKey, webpBuffer, {
        'Content-Type': 'image/webp',
      });

      const webpMetadata = await sharp(webpBuffer).metadata();
      variantRecords.push({
        imageId,
        variantType: `${variantName}_webp`,
        bucketName: bucket,
        objectKey: webpKey,
        fileSize: webpBuffer.length,
        width: webpMetadata.width,
        height: webpMetadata.height,
      });
    }

    // Save variants to database
    for (const variant of variantRecords) {
      await query(
        `INSERT INTO image_variants 
         (image_id, variant_type, bucket_name, object_key, file_size, width, height) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          variant.imageId,
          variant.variantType,
          variant.bucketName,
          variant.objectKey,
          variant.fileSize,
          variant.width,
          variant.height,
        ]
      );
    }

    // Update image status to active
    await query(
      `UPDATE images 
       SET status = 'active', has_thumbnail = TRUE, has_compressed = TRUE 
       WHERE id = ?`,
      [imageId]
    );

    console.log(`Successfully processed image ${message.uuid}`);
  }

  function resizeImage(imageBuffer, config, format) {
    return sharp(imageBuffer)
      .resize(config.width, config.height, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toFormat(format, {
        quality: config.quality,
        progressive: true,
      })
      .toBuffer();
  }


const imageProcessingConsumer = createRetryingConsumer({
  baseTopic: 'image.processing',
  groupId: process.env.KAFKA_IMAGE_PROCESSING_GROUP || 'image-processing-group',
  retry: {
    maxRetries: Number(process.env.KAFKA_IMAGE_PROCESSING_MAX_RETRIES || 5),
    delayMs: Number(
      process.env.KAFKA_IMAGE_PROCESSING_RETRY_DELAY_MS || 60_000
    ),
  },
  handler: async ({ value, key, headers, topic, partition, offset, rawMessage }) => {
    if (!value) throw new Error('Empty message');

    try {
      await processImage(value);
    } catch (error) {
      // TODO: handle retry logic here
    }
  },
});

module.exports = { imageProcessingConsumer };
