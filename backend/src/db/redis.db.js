import redis from "redis";

const url = process.env.REDIS_URI;

const client = redis.createClient({
  url,
});

client.on("connect", () => {
  console.log(`Redis Connected at: ${url}`);
});

client.on("error", (err) => {
  console.log(`Redis Connection Error: ${err}`);
});

export default client;
