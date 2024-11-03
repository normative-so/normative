import { Worker } from "bullmq";
import { processDatabase } from "./processDatabase.mjs";
import { processPage } from "./processPage.mjs";
import { processDatabaseList } from "./processDatabaseList.mjs";

const worker = new Worker('normative', async job => {

    switch (job.name) {
        case 'processDatabaseList':
            console.log('Processing database list');
            await processDatabaseList();
            break;

        case 'processDatabase':
            console.log('Processing database:', job.data.id);
            await processDatabase(job.data);
            break;

        case 'processPage':
            console.log('Processing page:', job.data.page.id);
            await processPage(job.data);
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