import mongoose, { model, Schema } from "mongoose";

const fileSchema = new Schema(
  {
    fileUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const File = model("File", fileSchema);
export default File;
