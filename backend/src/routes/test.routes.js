import { Router } from "express";
import {
  imageSend,
  sendSuccess,
  throwError,
  validObjectId,
  reqAbort,
  sendMail,
} from "../controllers/test.controllers.js";
import verifyUser from "../middlewares/verifyUser.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";

const router = Router();

router.get("/success", sendSuccess);
router.get("/error", throwError);
router.get("/validObjectId", verifyUser, validObjectId);
router.get("/abort", reqAbort);
router.get("/sendMail", sendMail);

export default router;
