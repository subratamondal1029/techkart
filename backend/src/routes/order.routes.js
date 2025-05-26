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

router.use(verifyUser());

router.post("/payment/order", rateLimiter(5), generateRazorpayOrder);
router.post("/payment/status", rateLimiter(5), paymentStatus);
router
  .route("/")
  .get(rateLimiter(60), getOrders)
  .post(rateLimiter(5), createOrder);
router.get("/shipment", rateLimiter(60), getOrders);
router
  .route("/:id")
  .get(rateLimiter(60), getOrder)
  .patch(rateLimiter(5), updateContact)
  .delete(rateLimiter(5), cancelOrder);
router.patch("/status/:id", rateLimiter(5), updateOrderStatus);

export default router;
