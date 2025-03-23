import fs from "fs";
import path from "path";
import { deleteFile as cloudinaryDelete } from "../../src/utils/fileUploader.js";
import { v2 as cloudinary } from "cloudinary";
import File from "../../src/models/file.model.js";
import ApiError from "../../src/utils/apiError.js";

const getFailureLog = async () => {
  try {
    const filePath = path.resolve("storage/log/failures.json");

    if (fs.existsSync(filePath)) {
      const log = fs.readFile(filePath, (err, data) => {
        if (err) {
          throw new Error(`Error reading file: ${err}`);
        }
        return JSON.parse(data);
      });
    }
  } catch (error) {
    throw error;
  }
};

const cloudinaryFileExist = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    console.log(error);
    if (error.error.http_code === 404) {
      console.log("File not found in Cloudinary.");
      return false;
    }

    throw new ApiError(error.error.http_code, error.error.message); // Handle other errors
  }
};

const deleteFile = async (log) => {
  try {
    switch (log.type) {
      case "local":
        if (!fs.existsSync(log.path)) throw new Error("File not found"); // File not found, log should stay

        await fs.promises.unlink(log.path); // Successfully deleted
        return true;
      case "cloudinary":
        const exists = await cloudinaryFileExist(log.path);
        if (!exists) throw new Error("File not found in cloudinary"); // Cloudinary file not found, log should stay

        const deleted = await cloudinaryDelete(log.path, exists.resource_type);
        if (!deleted.success) throw new Error(deleted.message);
        return true;
      case "DB":
        const file = await File.findById(log.path);
        if (!file) throw new Error("File not found in DB"); // Document not found, log should stay

        const cloudinaryExists = await cloudinaryFileExist(file.publicId);
        if (!cloudinaryExists) throw new Error("File not found in cloudinary"); // Cloudinary file not found, log should stay

        const deletedDb = await cloudinaryDelete(
          file.publicId,
          cloudinaryExists.resource_type ||
            (file.entityType === "invoice" ? "raw" : "image")
        );

        if (!deletedDb.success) throw new Error(deletedDb.message);
        await file.deleteOne();
        return true;
      default:
        throw new Error("Invalid type"); // Invalid type, log should stay
    }
  } catch (error) {
    console.error(error); // Log error for debugging
    throw error;
  }
};

const queueDeleteFile = async () => {
  try {
    const log = await getFailureLog();

    const unsolvedErrors = log.deleteFiles.filter(
      (err) => !err.default && !err.solved && !err.attempted
    );

    if (unsolvedErrors.length === 0) return; // No files to process

    // Process files Delete
    await Promise.allSettled(
      unsolvedErrors.map(async (log) => {
        try {
          const deleted = await deleteFile(log);
          if (deleted) {
            log.solved = true;
            log.solvedAt = new Date().toISOString();
          } else {
            log.attemptError = new Error(
              "Deletion failed but no error was thrown"
            ); // Unexpected failure
          }
        } catch (error) {
          log.attemptError = error; // Store the error message
        }
        log.attempted = true; // Mark as attempted
        return log;
      })
    );

    // Update the log file with changes
    fs.writeFileSync(
      path.resolve("storage/log/failures.json"),
      JSON.stringify(log, null, 2)
    );
  } catch (error) {
    console.log(`Unexpected error in queueDeleteFile: ${error}`);
    fs.appendFileSync(
      path.resolve("storage/log/tempError.log"),
      `${new Date().toISOString()} - ${error.stack}\n`
    );
  }
};

export default queueDeleteFile;
