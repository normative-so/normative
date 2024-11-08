import { Worker } from "bullmq";
import { processDatabase } from "../jobs/database.mjs";

const worker = new Worker('database-queue', processDatabase, {
    connection: {
        url: process.env.REDIS_URL,
    },
    limiter: {
        max: 3,
        duration: 1000,
    },
});

export default worker;
