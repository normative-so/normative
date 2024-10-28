// import { enqueueRows } from "./enqueue/rows.mjs";
import queue from "./connections/bull.mjs";
import { databases } from "./utils/data.mjs";
import "./utils/worker.mjs";
import "./db/postgres.mjs";
import redis from "./connections/redis.mjs";

// await queue.addBulk(databases.map((database) => ({
//     name: 'processDatabase',
//     data: {
//         databaseId: database,
//     },
//     repeat: {
//         every: 1000 * 60,
//     }
// })));


while (true) {
    await queue.addBulk(databases.map((database) => ({
        name: 'processDatabase',
        data: {
            databaseId: database,
        }
    })));

    await new Promise((resolve) => setTimeout(resolve, 1000 * 60));

}

