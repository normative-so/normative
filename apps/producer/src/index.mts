// import { enqueueRows } from "./enqueue/rows.mjs";
import queue from "./connections/bull.mjs";
import { migrate } from "./db/migrator.mjs";
import { databases } from "./utils/data.mjs";
import "./utils/worker.mjs";
import express from "express";
import postRouter from "./routes/post.mjs";

await migrate();

const app = express();

const processDatabases = async () => {
    await queue.addBulk(databases.map((database) => ({
        name: 'processDatabase',
        data: {
            databaseId: database,
        }
    })));
}

setInterval(async () => {
    await processDatabases();
}, 1000 * 60);

app.use(express.json());

app.use('/post', postRouter);

app.listen(3000, () => {
    console.log("Producer running on http://0.0.0.0:3000");
})