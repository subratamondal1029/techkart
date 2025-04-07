import asyncHandler from "../utils/asyncHandler.js";
import File from "../models/file.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { cloudinaryUpload, cloudinaryDelete } from "../utils/fileUploader.js";
import axios from "axios";
import {
  deleteFile,
  uploadFile,
  deleteLocalFile,
} from "../utils/fileHandler.js";

const createFileDoc = asyncHandler(async (req, res) => {
  const { entityType } = req.body;

  const filePath = req.file?.path;
  if (!filePath) throw new ApiError(500, "File Upload failed");

  const file = await uploadFile(filePath, req.folder, entityType, req.user._id);

  res
    .status(201)
    .json(
      new ApiResponse(201, "File uploaded successfully", { file: file._id })
    );
});

const getFile = asyncHandler(async (req, res) => {
  const file = await File.findById(req.params.id);

  if (!file) throw new ApiError(404, "File not found");

  if (req.headers["if-none-match"] === file.updatedAt.getTime().toString()) {
    return res.status(304).end(); // Not Modified
  }

  const response = await axios({
    method: "GET",
    url: file.fileUrl,
    responseType: "stream",
  });

  const isDownload = req.query.download;

  res.setHeader(
    "Content-Disposition",
    `${isDownload !== undefined ? "attachment" : "inline"}; filename="${
      file.name || "file"
    }"`
  );
  res.setHeader("Content-Type", response.headers["content-type"]);
  res.setHeader("Content-Length", response.headers["content-length"]);
  res.setHeader("Cache-Control", "public, max-age=31536000");
  res.setHeader("ETag", file.updatedAt.getTime().toString());

  response.data.pipe(res);
});

const updateFileDoc = asyncHandler(async (req, res) => {
  const filePath = req.file?.path;
  if (!filePath) throw new ApiError(500, "File Upload failed");

  const existingFile = await File.findById(req.params.id);
  if (!existingFile) {
    deleteLocalFile(filePath);
    throw new ApiError(404, "File not found");
  }

  const createdUser = await User.findById(existingFile.userId);
  if (
    existingFile.entityType !== "invoice" &&
    createdUser._id.toString() !== req.user._id.toString()
  ) {
    deleteLocalFile(filePath);
    throw new ApiError(403, "Reject File Update");
  }
  if (
    existingFile.entityType === "invoice" &&
    createdUser.label !== "admin" &&
    createdUser.label !== "shipment" &&
    createdUser.label !== "delivery"
  ) {
    deleteLocalFile(filePath);
    throw new ApiError(403, "Reject File Update");
  }

  const uploadResponse = await cloudinaryUpload(
    filePath,
    req.folder,
    existingFile.entityType
  );
  if (!uploadResponse.success) throw new ApiError(500, "File Upload failed");

  const deleteResponse = await cloudinaryDelete(
    existingFile.publicId,
    existingFile.entityType === "invoice" ? "raw" : "image"
  );
  if (!deleteResponse.success) console.log(new Error(deleteResponse.message));

  existingFile.fileUrl = uploadResponse.url;
  existingFile.publicId = uploadResponse.public_id;
  existingFile.name = uploadResponse.fileName;

  await existingFile.save();

  res.json(
    new ApiResponse(200, "File updated successfully", {
      file: existingFile._id,
    })
  );
});

const deleteFileDoc = asyncHandler(async (req, res) => {
  const file = await File.findById(req.params.id);

  if (!file) throw new ApiError(404, "File not found");

  const createdUser = await User.findById(file.userId);

  if (
    file.entityType !== "invoice" &&
    createdUser._id.toString() !== req.user._id.toString()
  )
    throw new ApiError(403, "Reject File Delete");
  if (
    file.entityType === "invoice" &&
    req.user.label !== "admin" &&
    req.user.label !== "shipment" &&
    req.user.label !== "delivery"
  )
    throw new ApiError(403, "Reject File Delete");

  await deleteFile(file._id);

  res.json(new ApiResponse(200, "File deleted successfully"));
});

export { createFileDoc, getFile, updateFileDoc, deleteFileDoc };
