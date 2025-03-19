import { Router } from "express";
import { sendSuccess, throwError } from "../controllers/test.controllers.js";

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

export default router;
