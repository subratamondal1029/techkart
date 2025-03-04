import mongoose, { model, Schema } from "mongoose";

const CartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    isOrdered: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Cart = model("Cart", CartSchema);
export default Cart;
