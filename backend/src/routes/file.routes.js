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

const router = Router();

router.post(
  "/",
  verifyUser,
  selectFolder,
  upload.single("file"),
  createFileDoc
);
router
  .route("/:id")
  .get(getFile)
  .patch(verifyUser, selectFolder, upload.single("file"), updateFileDoc)
  .delete(verifyUser, deleteFileDoc);

export default router;
