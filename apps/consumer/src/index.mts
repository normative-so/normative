import { Worker } from 'bullmq';

const worker = new Worker('post', async job => {
    console.log('Processing job:', job.id);
    const data = job;

    console.log('Data:', data);


    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Job completed:', job.id);
}, {
    connection: {
        url: process.env.REDIS_URL,
    },
});

// Handle job failures
worker.on('failed', (job, err) => {
    console.error(`Job ${job} failed with error: ${err.message}`);
});
