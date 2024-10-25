import { Queue } from 'bullmq';
import redis from './redis.mjs';

const queue = new Queue('normative', {
    connection: redis,
});

export default queue;