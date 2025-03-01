import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const rootGet = asyncHandler((req, res) => {
  res.json(new ApiResponse());
});

export { rootGet };
