import ApiError from "../utils/apiError.js";

export default function errorHandler(err, req, res, next) {
  const errorObj = new ApiError(err.status, err.message);
  console.log(errorObj); // Log error object

  res.status(errorObj.status || 500).json(errorObj); // Send error response
}
