import { Router } from "express";
import verifyUser from "../middlewares/verifyUser.middleware.js";
import {
  generateRazorpayOrder,
  createOrder,
  cancelOrder,
  getOrder,
  getOrders,
  updateContact,
} from "../controllers/order.controllers.js";

const router = Router();

router.use(verifyUser);

router.post("/generatePayment", generateRazorpayOrder);
router.route("/").get(getOrders).post(createOrder);
router.route("/:id").get(getOrder).patch(updateContact).delete(cancelOrder);

export default router;
