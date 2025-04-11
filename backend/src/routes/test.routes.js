import { Router } from "express";
import {
  sendSuccess,
  throwError,
  healthCheck,
} from "../controllers/test.controllers.js";

const router = Router();

router.get("/success", sendSuccess);
router.get("/error", throwError);
router.get("/health", healthCheck);

export default router;
