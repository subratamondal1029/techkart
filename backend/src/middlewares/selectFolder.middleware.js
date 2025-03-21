import File from "../models/file.model.js";
import ApiError from "../utils/apiError.js";

const selectFolder = async (req, res, next) => {
  const entityType =
    req.body.entityType || (await File.findById(req.params?.id).entityType);

  if (!entityType) {
    res.status(400).json(new ApiError(400, "Entity Type is required"));
    return;
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
