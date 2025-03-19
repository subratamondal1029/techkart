import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const generateTokens = async (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE,
  });
  const refreshToken = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE,
  });

  await User.findByIdAndUpdate(id, { $set: { refreshToken } });

  return { accessToken, refreshToken };
};
