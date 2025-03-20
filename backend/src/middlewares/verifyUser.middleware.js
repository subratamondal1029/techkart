import ApiError from "../utils/apiError.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export default async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers["authorization"]?.replace("Bearer ", "") ||
      req.query?.accessToken ||
      req.body?.accessToken;

    if (!token) throw new ApiError(401, "Unauthorized");

    // login with accessToken
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!payload || !payload.id) throw new ApiError(401, "Invalid Token");

    const user = await User.findById(payload.id);

    if (!user) throw new ApiError(404, "User Not found");

    req.user = user;
    next();
  } catch (error) {
    res
      .status(error.status || 500)
      .json(new ApiError(error.status, error.message));
  }
};
