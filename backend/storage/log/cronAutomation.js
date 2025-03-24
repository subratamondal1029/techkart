import cron from "node-cron";
import { queueDeleteFile } from "./deleteFile.js";
import clearLog from "./clearLog.js";
import nodemailer from "nodemailer";

const sendMail = async (body) => {
  try {
    console.log(body);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const response = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_RECEIVER_EMAILS,
      subject: "Daily Cleanup Report",
      html: body,
    });

    console.log("Report sent: %s", response.messageId);
    console.log(`Report Sent to ${response.accepted.join(", ")}`);
  } catch (error) {
    console.log(`Error while sending daily cleanup report: ${error}`);
  }
};

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

  sendMail(mailBody);
});
