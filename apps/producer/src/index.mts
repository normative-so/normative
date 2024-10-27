// import { enqueueRows } from "./enqueue/rows.mjs";
import queue from "./connections/bull.mjs";
import { databases } from "./utils/data.mjs";
import "./utils/worker.mjs";
import { db } from "./connections/postgres.mjs";

// await queue.addBulk(databases.map((database) => ({
//     name: 'processDatabase',
//     data: {
//         databaseId: database,
//     },
//     repeat: {
//         every: 1000 * 60,
//     }
// })));


