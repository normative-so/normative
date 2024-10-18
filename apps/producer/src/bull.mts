import { Queue } from 'bullmq';

export const postQueue = new Queue('post', {
    connection: {
        url: process.env.REDIS_URL,
    }
});
