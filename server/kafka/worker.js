require('module-alias/register');
require('dotenv').config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
});

const logger = require('@config/logger.config');
const {
  createRetryingConsumer,
  disconnectAllProducers,
} = require('@kafka/index');

/**
 * Example worker process.
 *
 * You can define multiple consumers here, each with its own groupId/topic/handler.
 * This is where you'd run image processing, email sending, etc.
 */
async function main() {
  const consumers = [];

  consumers.push();

  await Promise.all(consumers.map((c) => c.start()));
  logger.info('Kafka worker started');

  const shutdown = async (reason) => {
    try {
      logger.info({ reason }, 'Kafka worker shutting down');
      await Promise.allSettled(consumers.map((c) => c.stop()));
      await disconnectAllProducers();
    } finally {
      process.exit(0);
    }
  };

  ['SIGTERM', 'SIGINT', 'SIGUSR2'].forEach((sig) => {
    process.once(sig, () => shutdown(sig));
  });
  ['unhandledRejection', 'uncaughtException'].forEach((evt) => {
    process.on(evt, (err) => {
      logger.error({ err }, `Process error: ${evt}`);
      shutdown(evt);
    });
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
