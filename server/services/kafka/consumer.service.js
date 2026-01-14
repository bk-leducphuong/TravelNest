const logger = require('../../config/logger.config');
const kafka = require('../../config/kafka.config');
const consumer = kafka.consumer({ groupId: 'order-processing-group' });

const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'orders', fromBeginning: false });

  logger.info('Worker: consumer is running');

  await consumer.run({
    autoCommitInterval: 5000,
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const data = JSON.parse(message.value.toString());

        // process the message
      } catch (error) {
        logger.error(error);
      }
    },
  });
};

startConsumer();

// Handle Graceful Shutdown
const errorTypes = ['unhandledRejection', 'uncaughtException'];
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

errorTypes.forEach((type) => {
  process.on(type, async (e) => {
    logger.error(`Process error: ${type}`);
    await consumer.disconnect();
    process.exit(1);
  });
});

signalTraps.forEach((type) => {
  process.once(type, async () => {
    await consumer.disconnect();
    process.exit(0);
  });
});
