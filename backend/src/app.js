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
  contactRouter,
} from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import passport from "./config/passport.js";
import path from "path";
import requestLogger from "./middlewares/requestLogger.middleware.js";
import "../storage/log/cronAutomation.js";
import swaggerUi from "swagger-ui-express";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use(express.static(path.resolve("public")));

// Request logger
app.use("/api", requestLogger);

// Swagger
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(require("../test/swagger.json"))
);

// slowdown the response for testing in development mode
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    setTimeout(next, 1000);
  });
}

// Routes define
app.get("/favicon.ico", (req, res) =>
  res.redirect("/api/v1/files/67eeb1fcfaf070cbfb48da8c")
);
app.use("/api/v1/test", testRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/files", fileRouter);
app.use("/api/v1/contact", contactRouter);

// Error handler
app.use(errorHandler);

export default app;
