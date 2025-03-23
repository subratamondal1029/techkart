import fs from "fs";
import path from "path";

class FailureLog {
  constructor(type, data, error) {
    if (type === "local") {
      this.path = data;
    } else {
      this.id = data;
    }

    this.error = error;
    this.solved = false;
    this.default = false;
    this.timestamp = new Date().toISOString();
  }
}

const addToDelete = (
  type,
  { filePath, publicId, resourceType, documentId },
  error
) => {
  fs.readFile(path.resolve("storage/log/failures.json"), (err, data) => {
    if (err) {
      console.log(`Error reading file: ${err}`);
      return;
    }
    const parsedData = JSON.parse(data);

    switch (type) {
      case "local":
        if (parsedData.deleteFile.local.some((log) => log.path !== filePath)) {
          const log = new FailureLog(type, filePath, error);
          parsedData.deleteFile.local.push(log);
        }
        break;

      case "cloudinary":
        if (documentId) {
          if (
            parsedData.deleteFile.cloudinary.documents.some(
              (log) => log.id !== documentId
            )
          ) {
            const log = new FailureLog(type, documentId, error);
            parsedData.deleteFile.cloudinary.documents.push(log);
          }
        } else if (publicId) {
          if (
            parsedData.deleteFile.cloudinary.publicIds.some(
              (log) => log.id !== publicId
            )
          ) {
            const log = new FailureLog(type, publicId, error);
            parsedData.deleteFile.cloudinary.publicIds.push({
              ...log,
              resourceType,
            });
          }
        }
        break;

      default:
        console.log("Invalid type");
        break;
    }

    fs.writeFile(
      path.resolve("storage/log/failures.json"),
      JSON.stringify(parsedData),
      (err) => {
        console.log(`Error writing log file: ${err}`);
        fs.appendFile(path.resolve("storage/log/tempError.log"), err.stack);
      }
    );
  });
};

export default addToDelete;
