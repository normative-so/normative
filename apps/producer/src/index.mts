import express from "express";
import { initializeApp } from "./initializers/index.mjs";
import routes from "./routes/index.mjs";

const app = express();
app.use(express.json());

await initializeApp();

app.use(routes);

app.get("/", (req, res) => {
    res.send("Doing science");
});

app.listen(3000, () => {
    console.log("Producer running on http://0.0.0.0:3000");
})