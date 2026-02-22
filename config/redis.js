const redis = require('redis');

// Create Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 3) {
        console.log('⚠️  Redis unavailable - running without cache');
        return new Error('Redis max retries reached');
      }
      return retries * 500;
    }
  }
});

// Error handling
redisClient.on('error', (err) => {
  // Silently handle connection errors
});

redisClient.on('connect', () => {
  console.log('✅ Connected to Redis - caching enabled');
});

// Connect to Redis (non-blocking)
(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.log('⚠️  Running without Redis cache - app will work but slower');
  }
})();

module.exports = redisClient;
