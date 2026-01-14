const logger = require('../../utils/logger');
const kafka = require('../../config/kafka.config');
const producer = kafka.producer({
  allowAutoTopicCreation: false, // Topic management should be handled by CI/CD
  transactionTimeout: 30000,
});

const connectProducer = async () => {
  await producer.connect();
};

const sendMessage = async (topic, payload) => {
  try {
    await producer.send({
      topic,
      messages: [
        {
          key: payload.id.toString(), // Keying ensures order within a partition
          value: JSON.stringify(payload),
        },
      ],
      acks: -1, // Wait for all replicas to acknowledge (highest durability)
    });
  } catch (err) {
    logger.error(err);
  }
};

module.exports = { connectProducer, sendMessage, producer };
