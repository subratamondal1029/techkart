import { Router } from "express";
import {
  imageSend,
  sendSuccess,
  throwError,
  validObjectId,
  reqAbort,
} from "../controllers/test.controllers.js";
import verifyUser from "../middlewares/verifyUser.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";

const router = Router();

router.get(
  "/success",
  (req, res, next) => {
    res.cookie("test", "test cookie from middleware");
    next();
  },
  sendSuccess
);
router.get("/error", throwError);
router.get("/validObjectId", verifyUser, validObjectId);
router.get("/abort", reqAbort);

export default router;
