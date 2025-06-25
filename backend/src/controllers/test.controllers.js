import mongoose from "mongoose";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const sendSuccess = asyncHandler((req, res) => {
  res.json(new ApiResponse());
});

const throwError = asyncHandler(async (req, res) => {
  throw new Error("This is an error");
});

const healthCheck = asyncHandler(async (req, res) => {
  const db = await (await mongoose.connection.db.stats()).db;
  const data = {
    uptime: process.uptime(),
    db,
    environment: process.env.NODE_ENV,
    timeStamp: new Date(),
  };

  res.json(new ApiResponse(200, "Success", data));
});

export { sendSuccess, throwError, healthCheck };
