import { Router } from "express";
import verifyUser from "../middlewares/verifyUser.middleware.js";
import { getCart, addProductToCart } from "../controllers/cart.controllers.js";

const router = Router();

router.use(verifyUser());

router.route("/").get(getCart).put(addProductToCart);

export default router;
