import { Worker } from "bullmq";
import { processDatabase } from "./processDatabase.mjs";

const worker = new Worker('normative', async job => {

    switch (job.name) {
        case 'processDatabase':
            console.log('Processing database:', job.id);
            await processDatabase(job.data.databaseId);

            break;

        case 'processPage':
            console.log('Processing page:', job.id);
            break;
        default:

            break;
    }

}, {
    connection: {
        url: process.env.REDIS_URL,
    },
});

worker.on('failed', (job, err) => {
    console.error(`Job ${job} failed with error: ${err.message}`);
});