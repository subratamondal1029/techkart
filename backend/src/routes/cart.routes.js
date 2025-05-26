import { Router } from "express";
import verifyUser from "../middlewares/verifyUser.middleware.js";
import { getCart, addProductToCart } from "../controllers/cart.controllers.js";
import rateLimiter from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router.use(verifyUser());

router.route("/").get(getCart).put(rateLimiter(10), addProductToCart);

export default router;
