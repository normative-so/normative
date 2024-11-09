import express from "express";
import { initializeApp } from "./initializers/index.mjs";
import routes from "./routes/index.mjs";

const app = express();
app.use(express.json());

await initializeApp();

app.use(routes);

app.get("/", (req, res) => {
    res.json({
        hostname: req.hostname,
        message: 'Doing science',
        unix: Date.now(),
        time: new Date().toISOString(),
    });
});

app.listen(3000, () => {
    console.log("Producer running on http://0.0.0.0:3000");
})