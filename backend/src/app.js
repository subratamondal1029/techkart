import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
  cartRouter,
  productRouter,
  testRouter,
  usersRouter,
  orderRouter,
  fileRouter,
} from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import passport from "./config/passport.js";
import path from "path";

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.ORIGIN || "http://localhost:5173",
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use(express.static(path.resolve("public")));

// Routes define
app.use("/api/v1/test", testRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/files", fileRouter);

// Error handler
app.use(errorHandler);

export default app;
