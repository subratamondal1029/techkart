import mongoose, { model, Schema } from "mongoose";

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
      unique: true,
    },
    cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    invoice: {
      type: Schema.Types.ObjectId,
      ref: "File",
    },
    isShipped: {
      type: Boolean,
      default: false,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
    isRefund: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Order = model("Order", orderSchema);
export default Order;
