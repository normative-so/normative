import { Worker } from "bullmq";
import { processPage } from "../jobs/pages.mjs";

const worker = new Worker('pages-queue', processPage, {
    connection: {
        url: process.env.REDIS_URL,
    },
    limiter: {
        max: 3,
        duration: 1000,
    },
});

export default worker;