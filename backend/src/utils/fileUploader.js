import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import addToDelete from "../../storage/log/addToDelete.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = async (filePath, folder, resource_type = "image") => {
  try {
    const response = await cloudinary.uploader.upload(filePath, {
      folder: `techkart/${folder}`,
      resource_type,
      transformation: [
        { width: 500, height: 500, crop: "fill" },
        { quality: "auto:eco" },
      ],
    });

    return {
      success: true,
      url: response.secure_url,
      public_id: response.public_id,
      fileName: response.original_filename,
    };
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          addToDelete("local", { filePath }, err.stack);
        }
      });
    }
    return { success: false, message: error.message };
  }
};

const deleteFile = async (publicId, resource_type = "image") => {
  try {
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type,
    });

    return { success: true, ...response };
  } catch (error) {
    addToDelete(
      "cloudinary",
      { publicId, resourceType: resource_type },
      error.stack || error
    );
    return { success: false, message: error.message };
  }
};

export { uploadFile, deleteFile };
