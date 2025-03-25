import fs from "fs";
import path from "path";

const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      referer: req.headers.referer,
      status: res.statusCode,
      responseTime: `${Date.now() - start}ms`,
    };

    const logFilePath = path.resolve("storage/log/requests.log");

    fs.appendFile(logFilePath, JSON.stringify(logData) + "\n", (err) => {
      if (err) console.error("Error writing request log:", err);
    });
  });

  next();
};

export default requestLogger;
