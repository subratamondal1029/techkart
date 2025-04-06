import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import addToDelete from "../../storage/log/addToDelete.js";
import { deleteLocalFile } from "./fileHandler.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUpload = async (filePath, folder, resource_type = "image") => {
  try {
    const options = {
      folder: `techkart/${folder}`,
      resource_type,
    };

    if (resource_type === "image") {
      options.transformation = [
        { width: 500, height: 500, crop: "fill" },
        { quality: "auto:eco" },
      ];
    }

    const response = await cloudinary.uploader.upload(filePath, options);

    deleteLocalFile(filePath);

    return {
      success: true,
      url: response.secure_url,
      public_id: response.public_id,
      fileName: response.original_filename,
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
