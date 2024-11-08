import { Worker } from "bullmq";
import { processNestedBlocks } from "../jobs/nestedBlocks.mjs";

const worker = new Worker('nested-block-queue', processNestedBlocks, {
    connection: {
        url: process.env.REDIS_URL,
    }
});

export default worker;