import { Queue } from 'bullmq';
import redis from '../connections/redis.mjs';

const pagesQueue = new Queue('pages-queue', {
    connection: redis,
});

export default pagesQueue;