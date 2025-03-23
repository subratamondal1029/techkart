import fs from "fs";
import { isValidObjectId } from "mongoose";
import path from "path";

class FailureLog {
  constructor(type, data, error) {
    this.default = false;
    this.type = type;
    this.path = data;
    this.error = error;
    this.created_at = new Date().toISOString();
    this.solved = false;
    this.solvedAt = null;
    this.attempted = false;
    this.attemptError = null;
  }
}

/**
 * Adds a file to the deletion log.
 *
 * @param {("local" | "cloudinary" | "DB")} type - The type of storage. Allowed values: `"local"`, `"cloudinary"`, `"DB"`.
 * @param {String} fileRef - If file is local then pass path or pass DB id or cloudinary public id.
 * @param {String} error - The error stack or error.
 * @returns {undefined} This function does not return anything.
 * @throws {Error} If an invalid type is provided or an invalid DB id is provided.
 */
const addToDelete = (type, fileRef, error) => {
  fs.readFile(path.resolve("storage/log/failures.json"), (err, data) => {
    if (err) {
      console.log(`Error reading file: ${err}`);
      return;
    }
    const parsedData = JSON.parse(data);

    if (!["local", "cloudinary", "DB"].includes(type))
      throw new Error("Invalid type");

    if (type === "DB" && !isValidObjectId(fileRef))
      throw new Error("Invalid DB id");

    const log = new FailureLog(type, fileRef, error);
    parsedData.deleteFiles.push(log);

    fs.writeFile(
      path.resolve("storage/log/failures.json"),
      JSON.stringify(parsedData),
      (err) => {
        console.log(`Error writing log file: ${err}`);
        fs.appendFile(
          path.resolve("storage/log/tempError.log"),
          `${new Date().toISOString()} - ${error.stack}\n`
        );
      }
    );
  });
};

export default addToDelete;
