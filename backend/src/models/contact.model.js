import { Schema, model } from "mongoose";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Contact = model("Contact", contactSchema);
export default Contact;
