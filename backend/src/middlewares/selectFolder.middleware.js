import addToDelete from "../../storage/log/addToDelete.js";
import File from "../models/file.model.js";
import ApiError from "../utils/apiError.js";
import fs from "fs";

const deleteFile = async (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      await fs.promises.unlink(filePath);
    } catch (err) {
      addToDelete("local", filePath, err.stack || err);
    }
  }
};

const selectFolder = async (req, res, next) => {
  const existingFile = await File.findById(req.params?.id);

  if (!existingFile && req.method === "PATCH") {
    return res.status(404).json(new ApiError(404, "File not found"));
  }

  const entityType =
    req.body.entityType || (existingFile && existingFile?.entityType);

  if (!entityType) {
    await deleteFile(req.file?.path);
    return res.status(400).json(new ApiError(400, "Entity Type is required"));
  }

  const validLabels = {
    avatar: ["admin", "user", "shipment", "seller", "delivery"],
    invoice: ["admin", "shipment", "delivery"],
    product: ["admin", "seller"],
    default: ["admin"],
  };

  if (
    !validLabels[entityType] ||
    !validLabels[entityType].includes(req.user.label)
  ) {
    await deleteFile(req.file?.path);
    return res
      .status(403)
      .json(
        new ApiError(403, "Unauthorized request", [
          `User with label ${req.user.label} is not authorized to upload a ${entityType}`,
        ])
      );
  }

  const validTypes = Object.keys(validLabels);
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
      break;

    case "default":
      folderName = "default";
      break;
  }

  req.folder = folderName;
  next();
};

export default selectFolder;
