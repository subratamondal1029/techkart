import multer from "multer";
import path from "path";
const acceptTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
  "application/pdf",
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("storage/temp"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${path.parse(file.originalname).name}_${
        req.user?._id || "anonymous"
      }_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (!acceptTypes.includes(file.mimetype)) {
    return cb(new Error(`Only ${acceptTypes.join(", ")} are allowed`), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

export default upload;
