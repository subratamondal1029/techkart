import fs from "fs";
import path from "path";

const addToDelete = ({ filePath, publicId, documentId }) => {
  fs.readFile(path.resolve("storage/log/failures.json"), (err, data) => {
    if (err) {
      console.log(`Error reading file: ${err}`);
      return;
    }
    const parsedData = JSON.parse(data);

    if (filePath) {
      if (!parsedData.deleteFile.local.includes(filePath))
        parsedData.deleteFile.local.push(filePath);
    }

    if (publicId) {
      if (!parsedData.deleteFile.cloudinary.publicId.includes(publicId))
        parsedData.deleteFile.cloudinary.publicId.push(publicId);
    }

    if (documentId) {
      if (!parsedData.deleteFile.cloudinary.document.includes(documentId))
        parsedData.deleteFile.cloudinary.document.push(documentId);
    }

    fs.writeFile(
      path.resolve("storage/log/failures.json"),
      JSON.stringify(parsedData),
      (err) => {
        console.log(`Error writing file: ${err}`);
      }
    );
  });
};

export default addToDelete;
