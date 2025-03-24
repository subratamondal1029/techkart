import ApiError from "../utils/apiError.js";
import multer from "multer";

export default function errorHandler(err, req, res, next) {
  let errorObj;

  if (err instanceof multer.MulterError) {
    // Handle Multer-specific errors
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        errorObj = new ApiError(400, "File size should not exceed 5MB.");
        break;
      case "LIMIT_UNEXPECTED_FILE":
        errorObj = new ApiError(400, "Too many files uploaded.");
        break;
      default:
        errorObj = new ApiError(400, err.message);
        break;
    }
  } else if (err instanceof ApiError) {
    // Handle ApiError instances
    errorObj = err;
  } else {
    // Handle other errors
    errorObj = new ApiError(
      err.status || 500,
      err.message || "Internal Server Error",
      err.errors,
      err.stack
    );
  }

  console.log(errorObj); // Log error object for debugging
  res.status(errorObj.status).json(errorObj); // Send error response
}
