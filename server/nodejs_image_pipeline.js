// ============================================
// 1. DEPENDENCIES & SETUP
// ============================================

// npm install express multer minio amqplib sharp mysql2 uuid
// npm install heic-convert (for HEIC support)

const express = require('express');
const multer = require('multer');
const Minio = require('minio');
const amqp = require('amqplib');
const sharp = require('sharp');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// ============================================
// 2. CONFIGURATION
// ============================================

const config = {
  minio: {
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT) || 9000,
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost',
  },
  mysql: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'hotel_booking',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  },
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/heic',
      'image/heif',
    ],
  },
  processing: {
    maxRetries: 3,
    retryDelay: 60000, // 1 minute
  },
};

// Image variant configurations
const IMAGE_VARIANTS = {
  thumbnail: { width: 150, height: 150, quality: 85 },
  small: { width: 400, height: 400, quality: 85 },
  medium: { width: 800, height: 800, quality: 90 },
  large: { width: 1920, height: 1920, quality: 95 },
};

// ============================================
// 3. DATABASE CONNECTION POOL
// ============================================

const dbPool = mysql.createPool(config.mysql);

async function query(sql, params) {
  const [rows] = await dbPool.execute(sql, params);
  return rows;
}

// ============================================
// 4. MINIO CLIENT
// ============================================

const minioClient = new Minio.Client(config.minio);

// Ensure buckets exist
async function ensureBuckets() {
  const buckets = ['hotels', 'avatars', 'rooms', 'reviews'];

  for (const bucket of buckets) {
    const exists = await minioClient.bucketExists(bucket);
    if (!exists) {
      await minioClient.makeBucket(bucket, 'us-east-1');
      console.log(`Created bucket: ${bucket}`);
    }
  }
}

function getBucketName(entityType) {
  const bucketMap = {
    hotel: 'hotels',
    user_avatar: 'avatars',
    room: 'rooms',
    review: 'reviews',
  };
  return bucketMap[entityType] || 'hotels';
}

// ============================================
// 5. RABBITMQ CONNECTION & QUEUE SETUP
// ============================================

let rabbitChannel = null;

async function setupRabbitMQ() {
  try {
    const connection = await amqp.connect(config.rabbitmq.url);
    const channel = await connection.createChannel();

    // Main processing queue
    await channel.assertQueue('image.processing', {
      durable: true,
      arguments: {
        'x-max-priority': 10,
        'x-message-ttl': 3600000, // 1 hour
      },
    });

    // Retry queue with delay
    await channel.assertQueue('image.processing.retry', {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': '',
        'x-dead-letter-routing-key': 'image.processing',
        'x-message-ttl': config.processing.retryDelay,
      },
    });

    // Dead letter queue
    await channel.assertQueue('image.processing.dlq', {
      durable: true,
    });

    rabbitChannel = channel;
    console.log('RabbitMQ connected and queues configured');
    return channel;
  } catch (error) {
    console.error('Failed to setup RabbitMQ:', error);
    throw error;
  }
}

async function publishToQueue(queueName, message, priority = 5) {
  if (!rabbitChannel) {
    await setupRabbitMQ();
  }

  rabbitChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
    priority,
    contentType: 'application/json',
  });
}

// ============================================
// 6. FILE VALIDATION
// ============================================

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.upload.maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    if (config.upload.allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type. Allowed: ${config.upload.allowedMimeTypes.join(', ')}`
        )
      );
    }
  },
});

// ============================================
// 7. API ROUTES (EXPRESS)
// ============================================

const app = express();
app.use(express.json());

// Upload endpoint
app.post(
  '/api/v1/:entityType/:entityId/images',
  upload.single('image'),
  async (req, res) => {
    try {
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

      res.status(201).json({
        uuid: imageUuid,
        status: 'processing',
        message: 'Image uploaded successfully, processing in background',
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Get images for an entity
app.get('/api/v1/:entityType/:entityId/images', async (req, res) => {
  try {
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

    res.json({ images: imagesWithUrls });
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete image (soft delete)
app.delete('/api/v1/images/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;

    await query(
      `UPDATE images 
       SET status = 'deleted', deleted_at = NOW() 
       WHERE uuid = ?`,
      [uuid]
    );

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// 8. IMAGE PROCESSING WORKER
// ============================================

class ImageProcessingWorker {
  constructor() {
    this.maxRetries = config.processing.maxRetries;
  }

  async start() {
    try {
      const channel = await setupRabbitMQ();

      // Process one message at a time
      channel.prefetch(1);

      console.log('Worker started. Waiting for messages...');

      channel.consume('image.processing', async (msg) => {
        if (msg !== null) {
          try {
            const message = JSON.parse(msg.content.toString());
            console.log(`Processing image: ${message.uuid}`);

            await this.processImage(message);

            // Acknowledge message
            channel.ack(msg);
          } catch (error) {
            console.error('Processing error:', error);

            // Get retry count
            const retryCount = msg.properties.headers?.['x-retry-count'] || 0;

            if (retryCount < this.maxRetries) {
              // Requeue with retry
              await this.requeueWithRetry(channel, msg, retryCount + 1);
              channel.ack(msg);
            } else {
              // Send to DLQ
              await this.sendToDLQ(channel, msg, error);
              channel.ack(msg);
            }
          }
        }
      });
    } catch (error) {
      console.error('Worker startup error:', error);
      throw error;
    }
  }

  async processImage(message) {
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

  async resizeImage(imageBuffer, config, format) {
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

  async requeueWithRetry(channel, msg, retryCount) {
    channel.sendToQueue('image.processing.retry', msg.content, {
      headers: { 'x-retry-count': retryCount },
      persistent: true,
    });
    console.log(`Message requeued with retry count: ${retryCount}`);
  }

  async sendToDLQ(channel, msg, error) {
    const message = JSON.parse(msg.content.toString());

    // Update database
    await query('UPDATE images SET status = ? WHERE id = ?', [
      'failed',
      message.imageId,
    ]);

    // Send to DLQ
    channel.sendToQueue('image.processing.dlq', msg.content, {
      persistent: true,
      headers: { error: error.message },
    });

    console.error(
      `Message sent to DLQ: ${message.uuid} - Error: ${error.message}`
    );
  }
}

// ============================================
// 9. STARTUP
// ============================================

async function startServer() {
  try {
    // Initialize MinIO buckets
    await ensureBuckets();

    // Initialize RabbitMQ
    await setupRabbitMQ();

    // Start Express server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`API Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

async function startWorker() {
  try {
    const worker = new ImageProcessingWorker();
    await worker.start();
  } catch (error) {
    console.error('Failed to start worker:', error);
    process.exit(1);
  }
}

// Run as server or worker based on NODE_ENV
if (process.env.NODE_MODE === 'worker') {
  startWorker();
} else {
  startServer();
}

module.exports = { app, ImageProcessingWorker };

