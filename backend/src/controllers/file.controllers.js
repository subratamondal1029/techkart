import asyncHandler from "../utils/asyncHandler.js";
import File from "../models/file.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { uploadFile, deleteFile } from "../utils/fileUploader.js";
import axios from "axios";

const createFileDoc = asyncHandler(async (req, res) => {
  const { entityType } = req.body;

  const fileUrl = req.file?.path;
  if (!fileUrl) throw new ApiError(500, "File Upload failed");

  const uploadedFile = await uploadFile(
    req.file.path,
    req.folder,
    entityType === "invoice" ? "raw" : "image"
  );

  if (!uploadedFile.success) throw new ApiError(500, "File Upload failed");

  const file = await File.create({
    userId: req.user._id,
    name: uploadedFile.fileName,
    fileUrl: uploadedFile.url,
    publicId: uploadedFile.public_id,
    entityType,
  });

  if (!file) throw new ApiError(500, "File Upload failed");
  // TODO: add in failure log

  res
    .status(201)
    .json(
      new ApiResponse(201, "File uploaded successfully", { file: file._id })
    );
});

const getFile = asyncHandler(async (req, res) => {
  const file = await File.findById(req.params.id);

  if (!file) throw new ApiError(404, "File not found");

  const response = await axios({
    method: "GET",
    url: file.fileUrl,
    responseType: "stream",
  });

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${file.name || "file"}"`
  );
  res.setHeader("Content-Type", response.headers["content-type"]);

  response.data.pipe(res);
});

const updateFileDoc = asyncHandler(async (req, res) => {
  const filePath = req.file?.path;
  if (!filePath) throw new ApiError(500, "File Upload failed");

  const existingFile = await File.findById(req.params.id);
  if (!existingFile) throw new ApiError(404, "File not found");
  // TODO: log in failure

  const createdUser = await User.findById(existingFile.userId);
  if (existingFile.entityType !== "invoice" && createdUser._id !== req.user._id)
    // TODO: log in failure
    throw new ApiError(403, "Reject File Update");
  if (
    existingFile.entityType === "invoice" &&
    createdUser.label !== "admin" &&
    createdUser.label !== "shipment" &&
    createdUser.label !== "delivery"
  )
    // TODO: log in failure
    throw new ApiError(403, "Reject File Update");

  const uploadResponse = await uploadFile(filePath, req.folder);
  if (!uploadResponse.success) throw new ApiError(500, "File Upload failed");

  try {
    await deleteFile(
      existingFile.publicId,
      existingFile.entityType === "invoice" ? "raw" : "image"
    );
  } catch (error) {
    console.error("Failed to delete old file:", error);
    // TODO: add to log in failure file for later cleanup
  }

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

  if (file.entityType !== "invoice" && createdUser._id !== req.user._id)
    throw new ApiError(403, "Reject File Delete");
  if (
    file.entityType === "invoice" &&
    createdUser.label !== "admin" &&
    createdUser.label !== "shipment" &&
    createdUser.label !== "delivery"
  )
    throw new ApiError(403, "Reject File Delete");

  const deleteResponse = await deleteFile(
    file.publicId,
    file.entityType === "invoice" ? "raw" : "image"
  );

  if (!deleteResponse.success) throw new ApiError(500, "File Deletion failed");

  await file.deleteOne();

  res.json(new ApiResponse(200, "File deleted successfully"));
});

export { createFileDoc, getFile, updateFileDoc, deleteFileDoc };
