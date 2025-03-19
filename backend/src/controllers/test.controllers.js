import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const sendSuccess = asyncHandler((req, res) => {
  res.json(new ApiResponse());
});

const throwError = asyncHandler(async (req, res) => {
  throw new Error("This is an error");
});

export { sendSuccess, throwError };
