import { Router } from "express";
import { rootGet } from "../controllers/test.controllers.js";

const router = Router();

router.get("/", rootGet);

export default router;
