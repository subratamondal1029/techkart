import { Router } from "express";
import {
  createContact,
  getContacts,
  resolveContact,
} from "../controllers/contact.controllers.js";
import verifyUser from "../middlewares/verifyUser.middleware.js";
import rateLimiter from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router.post("/", rateLimiter(1), createContact);
router.get("/", rateLimiter(20), verifyUser(), getContacts);
router.patch("/resolve/:id", rateLimiter(10), verifyUser(), resolveContact);

export default router;
