const kafka = require('@config/kafka.config');
const logger = require('@config/logger.config');

/**
 * Producer pool so you can create multiple producers by name (optional),
 * but still share connections across the app.
 */
const producers = new Map();

function getProducer(name = 'default', options = {}) {
  if (producers.has(name)) return producers.get(name);

  const producer = kafka.producer({
    allowAutoTopicCreation: false,
    // Safer defaults for at-least-once delivery
    idempotent: true,
    maxInFlightRequests: 1,
    transactionTimeout: 30000,
    ...options,
  });

  const entry = {
    name,
    producer,
    connected: false,
    connect: async () => {
      if (entry.connected) return;
      await producer.connect();
      entry.connected = true;
      logger.info({ name }, 'Kafka producer connected');
    },
    disconnect: async () => {
      try {
        await producer.disconnect();
      } finally {
        entry.connected = false;
      }
    },
    send: async ({ topic, messages, acks = -1, timeout }) => {
      await entry.connect();
      return producer.send({ topic, messages, acks, timeout });
    },
    sendBatch: async (args) => {
      await entry.connect();
      return producer.sendBatch(args);
    },
  };

  producers.set(name, entry);
  return entry;
}

async function disconnectAllProducers() {
  await Promise.allSettled([...producers.values()].map((p) => p.disconnect()));
}

module.exports = { getProducer, disconnectAllProducers };
