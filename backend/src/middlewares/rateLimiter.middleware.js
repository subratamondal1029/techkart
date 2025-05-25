import rateLimit from "express-rate-limit";
import ApiError from "../utils/apiError.js";

const rateLimiter = (reqPerMinute) => {
  return rateLimit({
    windowMs: 60 * 1000,
    max: reqPerMinute,
    handler: (req, res) => {
      return res
        .status(429)
        .json(
          new ApiError(
            429,
            "Too many requests, please try again after 1 minute."
          )
        );
    },
  });
};

export default rateLimiter;
