import express from "express";
import { TokenBucket } from "./bucket/TokenBucket";
import { MemoryStorage } from "./storage/MemoryStorage.js";
import { RedisStorage } from "./storage/RedisStorage";
import { redis } from "./config/redis";

const app = express();
app.use(express.json());

//const storage = new MemoryStorage();
const storage = new RedisStorage(redis);

const limiter = new TokenBucket(
    storage,
    10,
    2
);


app.post("/check", async (req, res) => {
    const { key } = req.body;

    if (!key) {
        return res.status(400).json({
            message: "Key is required",
        });
    }

    const result = await limiter.consume(key);

    return res.json(result);
});







app.get("/ ", (req, res) => (
    res.json({
        message: "token bucket ratelimiter service",
    })
));


export default app;