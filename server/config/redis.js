const redis = require("redis");

// Connect to Redis Cloud
const redisClient = redis.createClient({
  // password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
  },
});

// Connect to Redis
redisClient
  .connect()
  .then(() => console.log("Connected to Redis"))
  .catch((err) => console.error("Redis connection error:", err));

module.exports = redisClient;
