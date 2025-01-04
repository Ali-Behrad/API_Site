const Redis = require("ioredis");

const redis = new Redis({
    host: "127.0.0.1",
    port: 6379
});

redis.on("connect", () => {
    console.log("Connection to Redis");
});

redis.on("error", (error) => {
    console.log("Database Error: ", error)
});

module.exports = redis;