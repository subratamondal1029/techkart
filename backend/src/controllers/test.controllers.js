import { isValidObjectId } from "mongoose";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import axios from "axios";
import nodemailer from "nodemailer";
import File from "../models/file.model.js";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

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
  // const file = await File.findById(req.params.id);

  // if (!file) throw new ApiError(404, "File not found");

  // if (req.headers["if-none-match"] === file._id.toString()) {
  //   return res.status(304).end(); // Not Modified
  // }

  const secureUrl = cloudinary.url(req.query.id, {
    secure: true,
    resource_type: "raw",
  });

  const response = await axios({
    method: "GET",
    url: secureUrl,
    responseType: "stream",
  });

  const isDownload = req.query.download;

  res.setHeader(
    "Content-Disposition",
    `${isDownload !== undefined ? "attachment" : "inline"}; filename="${
      file?.name || "file"
    }.pdf"`
  );
  res.setHeader("Content-Type", response.headers["content-type"]);
  res.setHeader("Content-Length", response.headers["content-length"]);
  res.setHeader("Cache-Control", "public, max-age=31536000");
  // res.setHeader("ETag", file._id.toString());

  response.data.pipe(res);
});

const uploadPdf = asyncHandler(async (req, res) => {
  const file = req.file.path;

  if (!file) throw new ApiError(500, "File Upload failed");

  const upload = await cloudinary.uploader.upload(file, {
    resource_type: "raw",
    folder: "techkart/invoices",
  });
  console.log(
    `pdf uploaded successfully ${(upload.secure_url, upload.public_id)}`
  );
  res.json(new ApiResponse(200, "Success", upload));
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

const deleteRequest = asyncHandler(async (req, res) => {
  const { status } = req.params;
  let response;
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  try {
    if (status === "success") {
      response = await axios.get(`${baseUrl}/api/v1/test/success`);
    } else {
      response = await axios.get(`${baseUrl}/api/v1/test/error`);
    }
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }

  res.json(new ApiResponse(200, "Success", response?.data));
});

export {
  sendSuccess,
  throwError,
  validObjectId,
  imageSend,
  uploadPdf,
  sendMail,
  reqAbort,
  deleteRequest,
};
