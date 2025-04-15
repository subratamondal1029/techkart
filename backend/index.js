import "./src/config/dotenvConfig.js";
import app from "./src/app.js";
import connectMongoDB from "./src/db/mongodb.db.js";
import redisClient from "./src/db/redis.db.js";

const port = process.env.PORT || 8000;

(async () => {
  try {
    await connectMongoDB();
    await redisClient.connect();
    app.listen(port, () => console.log(`Server is Running on: ${port}`));
  } catch (error) {
    console.error("Initialization error: " + error);
  }
})();
