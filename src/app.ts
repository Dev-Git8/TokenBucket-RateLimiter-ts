import express from "express";
import { TokenBucket } from "./bucket/TokenBucket";

const app = express();
app.use(express.json());

const limiter = new TokenBucket(10, 2);


app.post("/check", (req, res) => {
    const { key } = req.body;

    if (!key) {
        return res.status(400).json({
            message: "Key is required",
        });
    }

    const result = limiter.consume(key);

    return res.json(result);
});







app.get("/ ", (req, res) => (
    res.json({
        message: "token bucket ratelimiter service",
    })
));


export default app;