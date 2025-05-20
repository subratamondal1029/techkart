import ApiError from "../utils/apiError.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { generateTokens } from "../utils/jwt.js";

export default async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers["authorization"]?.replace("Bearer ", "") ||
      req.query?.accessToken ||
      req.body?.accessToken;

    if (!token) throw new ApiError(401, "Unauthorized");
    req.token = token;
    // login with accessToken
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new ApiError(401, "Token Expired");
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new ApiError(401, "Something when wrong try to reload page");
      }
    }

    if (!payload || !payload.id) throw new ApiError(401, "Invalid Token");

    const user = await User.findById(payload.id);

    if (!user) throw new ApiError(404, "User Not found");

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json(new ApiError(error.status, error.message));
  }
};
