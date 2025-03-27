import mongoose, { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
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
      unique: true,
      index: 1,
    },
    avatar: {
      type: Schema.Types.ObjectId,
      ref: "File",
    },
    label: {
      type: String,
      enum: ["user", "shipment", "seller", "delivery", "admin"],
      default: "user",
    },
    provider: {
      type: String,
      enum: ["google", "local"],
      required: true,
      index: 1,
    },
    googleId: {
      type: String,
      index: 1,
    },
    password: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.refreshToken;
  return user;
};

const User = model("User", userSchema);
export default User;
