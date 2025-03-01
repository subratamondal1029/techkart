import { configDotenv } from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/db.js";

configDotenv({
  path: "./.env",
});

const port = process.env.PORT || 8000;

connectDB().then((response) => {
  app.listen(port, () => {
    console.log("Server is Running in port: ", port);
  });
});
