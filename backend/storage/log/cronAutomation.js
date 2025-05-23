import cron from "node-cron";
import { queueDeleteFile } from "./deleteFile.js";
import clearLog from "./clearLog.js";
import sendMail from "../../src/utils/sendMail.js";
import path from "path";
import fs from "fs";

cron.schedule("0 0 * * *", async () => {
  console.log("Running cleanup at midnight");
  // Your cleanup function here
  const { deleted, attempted } = await queueDeleteFile();
  const { clearCount, remainCount } = await clearLog();

  const mailBody = `
  <h1>Daily Cleanup Report</h1>
  <p><b>Deleted</b>: <b>${deleted}</b> files</p>
  <p><b>Attempted to delete</b>: <b>${attempted}</b> files</p>
  <p><b>Cleared</b>: <b>${clearCount}</b> Logs</p>
  <p><b>Remaining</b>: <b>${remainCount}</b> Logs</p>
  `;

  sendMail({
    body: mailBody,
    subject: "Daily Cleanup Report",
    receivers: process.env.DAILY_CLEANUP_RECEIVERS,
  });
});

// TODO: Work on this and store in a database
const generateReport = async () => {
  try {
    const logFilePath = path.resolve("storage/log/requests.log");

    const logs = fs.readFileSync(logFilePath);
    const logData = JSON.stringify(
      logs
        .toString()
        .trim()
        .split("\n")
        .map((log) => JSON.parse(log))
    );

    return JSON.parse(logData);
  } catch (error) {
    throw error;
  }
};

cron.schedule("0 0 1 * *", async () => {
  console.log("Generating request report at 1st day of the month");
  const logFilePath = path.resolve("storage/log/requests.log");

  fs.writeFileSync(logFilePath, "");
});
