import { Router } from "express";
import {
  createContact,
  getContacts,
  resolveContact,
} from "../controllers/contact.controllers.js";
import verifyUser from "../middlewares/verifyUser.middleware.js";

const router = Router();

router.post("/", createContact);
router.get("/", verifyUser, getContacts);
router.patch("/resolve/:id", verifyUser, resolveContact);

export default router;
