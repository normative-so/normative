import { Worker } from "bullmq";
import { processNestedBlocks } from "../jobs/nestedBlocks.mjs";

const worker = new Worker('nested-block-queue', processNestedBlocks, {
    connection: {
        url: process.env.REDIS_URL,
    },
    limiter: {
        max: 3,
        duration: 1000,
    },
});

export default worker;