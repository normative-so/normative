import { Queue } from 'bullmq';
import redis from '../connections/redis.mjs';

const databaseQueue = new Queue('database-queue', {
    connection: redis,
});

export default databaseQueue;