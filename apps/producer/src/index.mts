import express from "express";
import postRouter from "./routes/post.mjs";
import { initializeApp } from "./initializers/index.mjs";

const app = express();
app.use(express.json());

initializeApp();

app.use('/post', postRouter);

app.listen(3000, () => {
    console.log("Producer running on http://0.0.0.0:3000");
})