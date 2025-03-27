import addToDelete from "../../storage/log/addToDelete.js";
import File from "../models/file.model.js";
import ApiError from "../utils/apiError.js";
import fs from "fs";

const selectFolder = async (req, res, next) => {
  const existingFile = await File.findById(req.params?.id);
  const entityType =
    req.body.entityType || (existingFile && existingFile?.entityType);

  if (!entityType) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlink(req.file.path, (err) => {
        if (err) {
          addToDelete("local", req.file.path, err.stack || err);
          return;
        }

        console.log(`File deleted: ${req.file.path}`);
      });
    }

    return res.status(400).json(new ApiError(400, "Entity Type is required"));
  }

  const validTypes = ["invoice", "product", "avatar"];
  if (!validTypes.includes(entityType)) {
    res
      .status(400)
      .json(
        new ApiError(400, "Invalid Entity type", [
          `Entity Type must be one of: ${validTypes.join(", ")}`,
        ])
      );
    return;
  }

  let folderName;
  switch (entityType) {
    case "avatar":
      folderName = "users";
      break;

    case "product":
      folderName = "products";
      break;

    case "invoice":
      folderName = "invoices";
  }

  req.folder = folderName;
  next();
};

export default selectFolder;
