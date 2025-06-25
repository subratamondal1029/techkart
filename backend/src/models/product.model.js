import mongoose, { model, Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 1,
      required: true,
    },
    tags: [{ type: String }],
    category: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    image: {
      type: Schema.Types.ObjectId,
      ref: "File",
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Product = model("Product", productSchema);
export default Product;
