const redis = require('redis');

let client = null;
let isConnected = false;

const connectRedis = async () => {
  try {
    client = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => {
          // Exponential backoff
          return Math.min(retries * 100, 3000);
        }
      }
    });

    client.on('error', (err) => {
      console.error('❌ Redis Client Error:', err);
      isConnected = false;
    });

    client.on('connect', () => {
      console.log('✅ Redis connected successfully');
      isConnected = true;
    });

    client.on('end', () => {
      console.log('Redis connection closed');
      isConnected = false;
    });

    await client.connect();
    return client;
  } catch (error) {
    console.error('❌ Redis connection error:', error);
    // Don't crash the app if Redis fails
    return null;
  }
};

// Set cache with expiration (seconds)
const setCache = async (key, value, expiry = 3600) => {
  try {
    if (!client || !isConnected) return false;
    await client.setEx(key, expiry, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('❌ Redis set cache error:', error);
    return false;
  }
};

// Get cache
const getCache = async (key) => {
  try {
    if (!client || !isConnected) return null;
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('❌ Redis get cache error:', error);
    return null;
  }
};

// Delete cache
const deleteCache = async (key) => {
  try {
    if (!client || !isConnected) return false;
    await client.del(key);
    return true;
  } catch (error) {
    console.error('❌ Redis delete cache error:', error);
    return false;
  }
};

// Delete multiple keys with pattern
const deleteCachePattern = async (pattern) => {
  try {
    if (!client || !isConnected) return false;
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
    return true;
  } catch (error) {
    console.error('❌ Redis delete pattern error:', error);
    return false;
  }
};

// Check if Redis is connected
const isRedisConnected = () => {
  return isConnected && client !== null;
};

// Close Redis connection
const closeRedis = async () => {
  try {
    if (client) {
      await client.quit();
      isConnected = false;
      console.log('Redis connection closed');
    }
  } catch (error) {
    console.error('Redis close error:', error);
  }
};

module.exports = {
  connectRedis,
  setCache,
  getCache,
  deleteCache,
  deleteCachePattern,
  isRedisConnected,
  closeRedis,
  getClient: () => client
};