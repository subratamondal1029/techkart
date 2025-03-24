import { isValidObjectId } from "mongoose";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import axios from "axios";
import nodemailer from "nodemailer";

const sendSuccess = asyncHandler((req, res) => {
  res.json(new ApiResponse());
});

const throwError = asyncHandler(async (req, res) => {
  throw new Error("This is an error");
});

const validObjectId = asyncHandler(async (req, res) => {
  res.json(
    new ApiResponse(200, "Success", { isValid: isValidObjectId(req.user._id) })
  );
});

const imageSend = asyncHandler(async (req, res) => {
  const { type } = req.query;
  console.log(type);

  const fileUrl = "https://res.cloudinary.com/demo/image/upload/sample.jpg";

  // Fetch the file from Cloudinary
  const response = await axios({
    url: fileUrl,
    method: "GET",
    responseType: "stream",
  });

  // Set headers to prompt download
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="downloaded_file.jpg"'
  );
  res.setHeader("Content-Type", response.headers["content-type"]);

  // Pipe the Cloudinary response to the client
  response.data.pipe(res);
});

const reqAbort = asyncHandler(async (req, res) => {
  setTimeout(() => {
    res.json(new ApiResponse(200, "Success"));
  }, 5000);
});

const sendMail = asyncHandler(async (req, res) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"Maddison Foo Koch 👻"`, // sender address
    to: process.env.SMTP_RECEIVER_EMAILS, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  res.json(new ApiResponse(200, "Success", info));
});

export {
  sendSuccess,
  throwError,
  validObjectId,
  imageSend,
  sendMail,
  reqAbort,
};
