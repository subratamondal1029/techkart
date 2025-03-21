import { Router } from "express";
import {
  imageSend,
  sendSuccess,
  throwError,
  validObjectId,
} from "../controllers/test.controllers.js";
import verifyUser from "../middlewares/verifyUser.middleware.js";

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
router.get("/image", imageSend);

export default router;
