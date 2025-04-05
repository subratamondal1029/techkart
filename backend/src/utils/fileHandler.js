import fs from "fs";
import File from "../models/file.model.js";
import { cloudinaryUpload, cloudinaryDelete } from "./fileUploader.js";
import addToDelete from "../../storage/log/addToDelete.js";
import ApiError from "../utils/apiError.js";

/**
 * Uploads a file to Cloudinary and creates a corresponding document in the database.
 *
 * @param {string} filePath - The local path of the file to be uploaded.
 * @param {string} folder - The Cloudinary folder where the file will be stored.
 * @param {string} entityType - The type of entity (e.g., "invoice", "image").
 * @returns {Promise<Object>} - The newly created file document.
 * @throws {ApiError} - Throws an error if the upload or database operation fails.
 */
const uploadFile = async (filePath, folder, entityType) => {
  try {
    const uploadedFile = await cloudinaryUpload(
      filePath,
      folder,
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

    if (!file) {
      addToDelete(
        "cloudinary",
        uploadedFile.public_id,
        new Error("Failed while creating File document in DB").stack
      );

      throw new ApiError(500, "File Upload failed");
    }

    return file;
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes a file from Cloudinary and removes its corresponding document from the database.
 *
 * @param {string} fileId - The ID of the file document to be deleted.
 * @throws {ApiError} - Throws an error if the file is not found or deletion fails.
 */
const deleteFile = async (fileId) => {
  try {
    const file = await File.findById(fileId);

    if (!file) throw new ApiError(404, "File not found");

    const deleteResponse = await cloudinaryDelete(
      file.publicId,
      file.entityType === "invoice" ? "raw" : "image"
    );

    if (!deleteResponse.success)
      throw new ApiError(500, "File Deletion failed");

    await file.deleteOne();

    return true;
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes a local file from the filesystem.
 *
 * @param {string} filePath - The local path of the file to be deleted.
 */
const deleteLocalFile = async (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          addToDelete("local", filePath, err.stack || err);
        }
      });
    }
  } catch (error) {
    addToDelete("local", filePath, error.stack || error);
  }
};

export { uploadFile, deleteFile, deleteLocalFile };
