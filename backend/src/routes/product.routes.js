import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import verifyUser from "../middlewares/verifyUser.middleware.js";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controllers.js";

const router = Router();

router
  .route("/")
  .post(verifyUser, upload.single("file"), createProduct)
  .get(getProducts);
router.get("/seller", verifyUser, getProducts);
router
  .route("/:id")
  .get(getProduct)
  .delete(verifyUser, deleteProduct)
  .patch(verifyUser, upload.single("file"), updateProduct);

export default router;
