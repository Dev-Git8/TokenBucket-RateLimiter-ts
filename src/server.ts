import app from "./app.js";
import { redis } from "./config/redis.js";

const PORT = 3000;

async function startServer() {
    await redis.connect();

    console.log(" Redis Connected");

    

    app.listen(PORT, () => {
        console.log(` Server running on ${PORT}`);
    });
}

startServer();