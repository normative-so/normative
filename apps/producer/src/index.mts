import queue from "./connections/bull.mjs";
import { migrate } from "./db/migrator.mjs";
import "./utils/worker.mjs";
import express from "express";
import postRouter from "./routes/post.mjs";

await migrate();

const app = express();


setInterval(async () => {
    await queue.add('processDatabaseList', {});
}, 1000 * 10);

app.use(express.json());

app.use('/post', postRouter);

app.listen(3000, () => {
    console.log("Producer running on http://0.0.0.0:3000");
})