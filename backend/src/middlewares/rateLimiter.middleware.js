import rateLimit from "express-rate-limit";

const rateLimiter = (reqPerMinute) => {
  return rateLimit({
    windowMs: 60 * 1000,
    max: reqPerMinute,
    message:
      "Too many requests from this IP, Wait 1 minute before requesting again.",
  });
};

export default rateLimiter;
