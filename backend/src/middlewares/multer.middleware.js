import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("public/tmp"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.originalname}_${
        req.user._id || "anonymous"
      }_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 } });

export default upload;
