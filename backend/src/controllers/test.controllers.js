import { isValidObjectId } from "mongoose";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import axios from "axios";

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

export { sendSuccess, throwError, validObjectId, imageSend };
