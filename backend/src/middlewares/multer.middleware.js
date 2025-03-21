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

const fileFilter = (req, file, cb) => {
  if (acceptTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Only ${acceptTypes.join(", ")} are allowed`), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

export default upload;
