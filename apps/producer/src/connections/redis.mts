import Redis from 'ioredis';

// Create a Redis instance using the REDIS_URL from the environment variables
const redis = new Redis(process.env.REDIS_URL!!);

export default redis;