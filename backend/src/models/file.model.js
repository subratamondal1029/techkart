import mongoose, { model, Schema } from "mongoose";

const fileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
    },
    entityType: {
      type: String,
      required: true,
      enum: ["invoice", "product", "avatar", "default"],
    },
  },
  { timestamps: true }
);

const File = model("File", fileSchema);
export default File;
