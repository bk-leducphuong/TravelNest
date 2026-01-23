const kafka = require('@config/kafka.config');
const logger = require('@config/logger.config');
const { v4: uuidv4 } = require('uuid');

// Create producer pool for better performance
let producer = null;

/**
 * Initialize Kafka producer
 */
async function initProducer() {
  if (!producer) {
    producer = kafka.producer({
      allowAutoTopicCreation: true,
      transactionTimeout: 30000,
    });
    await producer.connect();
    logger.info('Kafka producer connected');
  }
  return producer;
}

/**
 * Publish a message to a Kafka topic with priority support
 * @param {string} topic - The Kafka topic name
 * @param {object} message - The message payload
 * @param {number} priority - Message priority (higher number = higher priority)
 * @param {string} key - Optional message key for partitioning
 * @returns {Promise<void>}
 */
async function publishToQueue(topic, message, priority = 5, key = null) {
  try {
    const producerInstance = await initProducer();

    const messagePayload = {
      topic,
      messages: [
        {
          key: key || uuidv4(),
          value: JSON.stringify(message),
          headers: {
            priority: priority.toString(),
            timestamp: Date.now().toString(),
            'content-type': 'application/json',
          },
        },
      ],
    };

    await producerInstance.send(messagePayload);
    logger.info(`Message published to topic: ${topic}`, {
      messageId: message.imageId || message.id,
      priority,
    });
  } catch (error) {
    logger.error('Error publishing to Kafka queue:', error);
    throw new Error(`Failed to publish message to queue: ${error.message}`);
  }
}

/**
 * Publish multiple messages in batch
 * @param {string} topic - The Kafka topic name
 * @param {Array<object>} messages - Array of message payloads
 * @param {number} priority - Message priority
 * @returns {Promise<void>}
 */
async function publishBatchToQueue(topic, messages, priority = 5) {
  try {
    const producerInstance = await initProducer();

    const messagePayloads = messages.map((message) => ({
      key: uuidv4(),
      value: JSON.stringify(message),
      headers: {
        priority: priority.toString(),
        timestamp: Date.now().toString(),
        'content-type': 'application/json',
      },
    }));

    await producerInstance.send({
      topic,
      messages: messagePayloads,
    });

    logger.info(`Batch of ${messages.length} messages published to topic: ${topic}`);
  } catch (error) {
    logger.error('Error publishing batch to Kafka queue:', error);
    throw new Error(`Failed to publish batch to queue: ${error.message}`);
  }
}

/**
 * Gracefully disconnect the producer
 */
async function disconnectProducer() {
  if (producer) {
    await producer.disconnect();
    producer = null;
    logger.info('Kafka producer disconnected');
  }
}

module.exports = {
  initProducer,
  publishToQueue,
  publishBatchToQueue,
  disconnectProducer,
};
