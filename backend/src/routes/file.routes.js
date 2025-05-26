import fs from "fs";
import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import {
  createFileDoc,
  deleteFileDoc,
  getFile,
  updateFileDoc,
} from "../controllers/file.controllers.js";
import verifyUser from "../middlewares/verifyUser.middleware.js";
import selectFolder from "../middlewares/selectFolder.middleware.js";
import addToDelete from "../../storage/log/addToDelete.js";
import rateLimiter from "../middlewares/rateLimiter.middleware.js";

const reqAbort = (req, res, next) => {
  req.on("aborted", () => {
    const filePath = req.file?.path;
    if (filePath && fs.existsSync(filePath)) {
      addToDelete("local", filePath, new Error("Request Aborted"));
    }
  });

  next();
};

const router = Router();

router.post(
  "/",
  rateLimiter(5),
  verifyUser(),
  upload.single("file"),
  selectFolder,
  reqAbort,
  createFileDoc
);
router
  .route("/:id")
  .get(getFile)
  .patch(
    rateLimiter(5),
    verifyUser(),
    upload.single("file"),
    selectFolder,
    reqAbort,
    updateFileDoc
  )
  .delete(rateLimiter(5), verifyUser(), deleteFileDoc);

export default router;
