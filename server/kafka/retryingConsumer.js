const kafka = require('@config/kafka.config');
const logger = require('@config/logger.config');
const { getProducer } = require('./producerPool');
const { getHeader, setHeader } = require('./utils/headers.util');
const { topicsFor } = require('./utils/topic.util');
const { sleep } = require('./utils/sleep.util');

function safeJsonParse(value) {
  if (value == null) return null;
  const s = Buffer.isBuffer(value) ? value.toString('utf8') : String(value);
  return JSON.parse(s);
}

function errorToString(err) {
  if (!err) return 'Unknown error';
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.stack || err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

/**
 * Create a consumer that supports:
 * - main topic processing
 * - delayed retries via <topic>.retry and headers
 * - dead-letter via <topic>.dlq
 *
 * Headers used:
 * - x-retry-count: number
 * - x-not-before: epoch millis
 * - x-original-topic: string
 * - x-error: string (dlq only)
 */
function createRetryingConsumer({
  baseTopic,
  groupId,
  handler, // async ({ value, key, headers, topic, partition, offset, rawMessage }) => void
  retry = {},
  fromBeginning = false,
  producerName = 'default',
}) {
  const { main, retry: retryTopic, dlq: dlqTopic } = topicsFor(baseTopic);

  const maxRetries =
    typeof retry.maxRetries === 'number' ? retry.maxRetries : 5;
  const delayMs = typeof retry.delayMs === 'number' ? retry.delayMs : 60_000; // 1 minute default

  const consumer = kafka.consumer({ groupId });
  const producer = getProducer(producerName);

  async function commitOffset({ topic, partition, offset }) {
    await consumer.commitOffsets([
      { topic, partition, offset: String(Number(offset) + 1) },
    ]);
  }

  async function publishToRetryOrDlq({
    targetTopic,
    key,
    value,
    headers,
    retryCount,
    err,
  }) {
    let outHeaders = { ...(headers || {}) };
    outHeaders = setHeader(outHeaders, 'x-retry-count', retryCount);
    outHeaders = setHeader(outHeaders, 'x-original-topic', baseTopic);

    if (targetTopic === retryTopic) {
      outHeaders = setHeader(outHeaders, 'x-not-before', Date.now() + delayMs);
    }

    if (targetTopic === dlqTopic) {
      outHeaders = setHeader(outHeaders, 'x-error', errorToString(err));
    }

    await producer.send({
      topic: targetTopic,
      messages: [{ key, value, headers: outHeaders }],
    });
  }

  async function maybeWaitForNotBefore(headers) {
    const notBeforeRaw = getHeader(headers, 'x-not-before');
    if (!notBeforeRaw) return;
    const notBefore = Number(notBeforeRaw);
    if (!Number.isFinite(notBefore)) return;
    const now = Date.now();
    if (notBefore > now) {
      await sleep(notBefore - now);
    }
  }

  async function processMessage({ topic, partition, message }) {
    const headers = message.headers || {};
    const retryCountRaw = getHeader(headers, 'x-retry-count');
    const retryCount = retryCountRaw ? Number(retryCountRaw) : 0;

    // Retry topic enforces delay via header
    if (topic === retryTopic) {
      await maybeWaitForNotBefore(headers);
    }

    try {
      await handler({
        topic,
        partition,
        offset: message.offset,
        key: message.key,
        headers,
        value: safeJsonParse(message.value),
        rawMessage: message,
      });

      await commitOffset({ topic, partition, offset: message.offset });
    } catch (err) {
      const nextRetryCount = retryCount + 1;

      if (nextRetryCount <= maxRetries) {
        await publishToRetryOrDlq({
          targetTopic: retryTopic,
          key: message.key,
          value: message.value,
          headers,
          retryCount: nextRetryCount,
          err,
        });

        logger.warn(
          {
            baseTopic,
            topic,
            partition,
            offset: message.offset,
            nextRetryCount,
            maxRetries,
          },
          'Kafka message failed; queued for retry'
        );
      } else {
        await publishToRetryOrDlq({
          targetTopic: dlqTopic,
          key: message.key,
          value: message.value,
          headers,
          retryCount: nextRetryCount,
          err,
        });

        logger.error(
          {
            baseTopic,
            topic,
            partition,
            offset: message.offset,
            retryCount: nextRetryCount,
            maxRetries,
          },
          'Kafka message failed; sent to DLQ'
        );
      }

      // Commit original offset after we have safely re-published (retry/dlq)
      await commitOffset({ topic, partition, offset: message.offset });
    }
  }

  async function start() {
    await consumer.connect();
    await consumer.subscribe({ topic: main, fromBeginning });
    await consumer.subscribe({ topic: retryTopic, fromBeginning: false });

    logger.info(
      { groupId, main, retryTopic, dlqTopic, maxRetries, delayMs },
      'Kafka consumer starting'
    );

    await consumer.run({
      autoCommit: false,
      eachMessage: processMessage,
    });
  }

  async function stop() {
    await consumer.disconnect();
  }

  return {
    start,
    stop,
    consumer,
    topics: { main, retry: retryTopic, dlq: dlqTopic },
  };
}

module.exports = { createRetryingConsumer };
