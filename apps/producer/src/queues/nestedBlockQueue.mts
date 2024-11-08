import { Queue } from 'bullmq';
import redis from '../connections/redis.mjs';

const nestedBlockQueue = new Queue('nested-block-queue', {
    connection: redis,
});

export default nestedBlockQueue;