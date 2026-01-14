const { Kafka, logLevel } = require('kafkajs');
require('dotenv').config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
});

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'my-kafka',
  brokers: process.env.KAFKA_BROKERS.split(',') || ['localhost:9092'],
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
  logLevel: logLevel.ERROR, // Avoid flooding logs in production
});

module.exports = kafka;
