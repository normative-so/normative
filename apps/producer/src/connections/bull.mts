import { Queue } from 'bullmq';
import redis from './redis.mjs';

const postQueue = new Queue('post', {
    connection: redis,
});

export default postQueue;