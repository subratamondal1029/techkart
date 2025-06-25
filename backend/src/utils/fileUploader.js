import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import addToDelete from "../../storage/log/addToDelete.js";
import { deleteLocalFile } from "./fileHandler.js";
import path from "path";
import ApiError from "./apiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUpload = async (filePath, folder, entityType) => {
  try {
    const resource_type = entityType === "invoice" ? "raw" : "image";

    const options = {
      folder: `techkart/${folder}`,
      resource_type,
      transformation: [],
    };

    if (resource_type === "image") {
      options.transformation = [
        { width: 500, height: 500, crop: "fill" },
        { quality: "auto:eco" },
      ];

      if (entityType === "avatar") {
        options.transformation[0] = { width: 96, height: 96, crop: "fill" };
      } else if (entityType === "default") {
        options.transformation[0] = {};
      }
    }

    const response = await cloudinary.uploader.upload(filePath, options);

    deleteLocalFile(filePath);

    return {
      success: true,
      url: response.secure_url,
      public_id: response.public_id,
      fileName: response.original_filename + path.extname(filePath),
    };
  } catch (error) {
    deleteLocalFile(filePath);
    return { success: false, message: error.message };
  }
};

const cloudinaryDelete = async (publicId, resource_type = "image") => {
  try {
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type,
    });

    return { success: true, ...response };
  } catch (error) {
    addToDelete("cloudinary", publicId, error.stack || error);
    return { success: false, message: error.message };
  }
};

export { cloudinaryUpload, cloudinaryDelete };
