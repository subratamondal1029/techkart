import { Router } from "express";
import verifyUser from "../middlewares/verifyUser.middleware.js";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controllers.js";
import rateLimiter from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router
  .route("/")
  .post(rateLimiter(5), verifyUser(), createProduct)
  .get(getProducts);
router.get("/seller", verifyUser(), getProducts);
router
  .route("/:id")
  .get(getProduct)
  .delete(rateLimiter(5), verifyUser(), deleteProduct)
  .patch(rateLimiter(5), verifyUser(), updateProduct);

export default router;
