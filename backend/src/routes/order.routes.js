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
import rateLimiter from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router.use(rateLimiter(5), verifyUser());

router.post("/payment/order", generateRazorpayOrder);
router.post("/payment/status", paymentStatus);
router.route("/").get(rateLimiter(60), getOrders).post(createOrder);
router.get("/shipment", rateLimiter(60), getOrders);
router
  .route("/:id")
  .get(rateLimiter(60), getOrder)
  .patch(updateContact)
  .delete(cancelOrder);
router.patch("/status/:id", updateOrderStatus);

export default router;
