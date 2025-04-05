import { Router } from "express";
import verifyUser from "../middlewares/verifyUser.middleware.js";
import {
  generateRazorpayOrder,
  paymentStatus,
  createOrder,
  cancelOrder,
  getOrder,
  getOrders,
  updateContact,
  updateOrderStatus,
} from "../controllers/order.controllers.js";

const router = Router();

router.use(verifyUser);

router.post("/payment/order", generateRazorpayOrder);
router.post("/payment/status", paymentStatus);
router.route("/").get(getOrders).post(createOrder);
router.route("/:id").get(getOrder).patch(updateContact).delete(cancelOrder);
router.patch("/status/:id", updateOrderStatus);

export default router;
