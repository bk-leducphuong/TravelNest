/**
 * Central topic helpers.
 *
 * Convention:
 * - <base>
 * - <base>.retry
 * - <base>.dlq
 */
function topicsFor(baseTopic) {
  return {
    main: baseTopic,
    retry: `${baseTopic}.retry`,
    dlq: `${baseTopic}.dlq`,
  };
}

module.exports = { topicsFor };
