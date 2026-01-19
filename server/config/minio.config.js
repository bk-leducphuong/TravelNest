const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: Number(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const bucketName = process.env.MINIO_BUCKET;

/**
 * Ensure bucket exists
 */
async function initBucket() {
  const exists = await minioClient.bucketExists(bucketName);
  if (!exists) {
    await minioClient.makeBucket(bucketName, 'us-east-1');
    // eslint-disable-next-line no-console
    console.log(`Bucket "${bucketName}" created`);
  }
}

/**
 * Build a public URL for an object.
 * If MINIO_PUBLIC_URL is set, use it as base, otherwise fall back to MINIO_ENDPOINT:MINIO_PORT.
 */
function getObjectUrl(objectName) {
  const base =
    process.env.MINIO_PUBLIC_URL ||
    `${process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http'}://${
      process.env.MINIO_ENDPOINT
    }:${process.env.MINIO_PORT}`;

  // Ensure no duplicate slashes
  return `${base.replace(/\/+$/, '')}/${bucketName}/${objectName.replace(/^\/+/, '')}`;
}

module.exports = { minioClient, initBucket, bucketName, getObjectUrl };
