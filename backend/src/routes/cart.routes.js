import { Router } from "express";
import verifyUser from "../middlewares/verifyUser.middleware.js";
import {
  createCart,
  getCart,
  addProductToCart,
} from "../controllers/cart.controllers.js";

const router = Router();

router.use(verifyUser);

router.post("/", createCart);
router.route("/:id").get(getCart).put(addProductToCart);

export default router;
