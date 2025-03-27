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
  verifyUser,
  upload.single("file"),
  selectFolder,
  reqAbort,
  createFileDoc
);
router
  .route("/:id")
  .get(getFile)
  .patch(
    verifyUser,
    upload.single("file"),
    selectFolder,
    reqAbort,
    updateFileDoc
  )
  .delete(verifyUser, deleteFileDoc);

export default router;
