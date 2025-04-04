import "./src/config/dotenvConfig.js";
import app from "./src/app.js";
import connectDB from "./src/db.js";

const port = process.env.PORT || 8000;

connectDB().then((response) => {
  const server = app.listen(port, () => {
    console.log("Server is Running on:", server.address().port);
  });
});
