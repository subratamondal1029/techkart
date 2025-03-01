export default function errorHandler(err, req, res, next) {
  console.error(err.stack); // Log the error
  const errorObj = {
    ...err,
    message: err.message || "Internal Server Error",
    status: err.status || 500,
  };
  res.status(500).json(errorObj); // Send error response
}
