import express from "express";
import cors from "cors";
import testRouter from "./routes/test.routes.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/test", testRouter);

app.use(errorHandler);

export default app;
