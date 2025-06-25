import { Router } from "express";
import {
  sendSuccess,
  throwError,
  healthCheck,
} from "../controllers/test.controllers.js";
import rateLimiter from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router.use(rateLimiter(50));
router.get("/success", sendSuccess);
router.get("/error", throwError);
router.get("/health", healthCheck);

export default router;
