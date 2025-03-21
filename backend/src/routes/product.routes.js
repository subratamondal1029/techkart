import { Router } from "express";
import verifyUser from "../middlewares/verifyUser.middleware.js";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controllers.js";

const router = Router();

router.route("/").post(verifyUser, createProduct).get(getProducts);
router.get("/seller", verifyUser, getProducts);
router
  .route("/:id")
  .get(getProduct)
  .delete(verifyUser, deleteProduct)
  .patch(verifyUser, updateProduct);

export default router;
