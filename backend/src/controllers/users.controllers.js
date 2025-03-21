import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import User from "../models/user.model.js";
import File from "../models/file.model.js";
import jwt from "jsonwebtoken";
import { generateTokens } from "../utils/jwt.js";
import passport from "../config/passport.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

const calculateExpiresInMilliseconds = (day) => {
  return day?.split("d")?.[0] * 24 * 60 * 60 * 1000;
};

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, label, avatar } = req.body;

  if (!name || !email || !password || !label) {
    throw new ApiError(400, "All fields are required");
  }

  if (!email.test(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
    throw new ApiError(400, "Invalid email");
  }

  if (!password.test(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)) {
    throw new ApiError(
      400,
      "Password must be at least 8 characters long and contain at least one number, one lowercase letter, and one uppercase letter"
    );
  }

  const user = await User.create({
    name,
    email,
    password,
    label,
    provider: "local",
    avatar,
  });

  if (!user) {
    throw new ApiError(500, "Failed to create user");
  }

  res.status(201).json(new ApiResponse(201, "User created", user));
});

const updateUser = asyncHandler(async (req, res) => {
  const { name, email, avatar } = req.body;

  if (!name && !email && !avatar)
    throw new ApiError(400, "At least One field is required");

  if (avatar) {
    const isAvatarExist = File.exists({ _id: avatar });
    if (!isAvatarExist) throw new ApiError(400, "Invalid Avatar Id");
    req.user.avatar = avatar;
  }
  if (name) req.user.name = name;
  if (email) req.user.email = email;

  await req.user.save();

  res.json(new ApiResponse(200, "User Details Updated", req.user));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });

  const isMatched = await user.comparePassword(password);

  if (!isMatched) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);

  res
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: calculateExpiresInMilliseconds(
        process.env.JWT_REFRESH_TOKEN_EXPIRE
      ),
    })
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: calculateExpiresInMilliseconds(
        process.env.JWT_ACCESS_TOKEN_EXPIRE
      ),
    })
    .header("accessToken", accessToken)
    .header("refreshToken", refreshToken)
    .json(
      new ApiResponse(200, "Login successful", {
        accessToken,
        refreshToken,
      })
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken =
    req.cookies?.refreshToken ||
    req.body?.refreshToken ||
    req.headers?.["refreshToken"];

  if (!refreshToken) {
    throw new ApiError(400, "Refresh token is required");
  }

  const payload = await jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);

  if (!payload) {
    throw new ApiError(403, "Invalid refresh token");
  }

  const user = await User.findById(payload.id);

  if (!user || user.refreshToken !== refreshToken) {
    throw new ApiError(403, "Invalid refresh token");
  }

  const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
    user._id
  );

  res
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: calculateExpiresInMilliseconds(
        process.env.JWT_REFRESH_TOKEN_EXPIRE
      ),
    })
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: calculateExpiresInMilliseconds(
        process.env.JWT_ACCESS_TOKEN_EXPIRE
      ),
    })
    .header("accessToken", accessToken)
    .header("refreshToken", newRefreshToken)
    .json(
      new ApiResponse(200, "Access token refreshed", {
        accessToken,
        refreshToken: newRefreshToken,
      })
    );
});

const logout = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { $unset: { refreshToken: "" } });

  res
    .clearCookie("refreshToken")
    .clearCookie("accessToken")
    .json(new ApiResponse(200, "Logout successful"));
});

const googleLoginRedirect = async (req, res, next) => {
  const { success, fails } = req.query;
  const state = JSON.stringify({
    successRedirect: `${process.env.FRONTEND_BASE_URL}/${success || ""}`,
    failureRedirect: `${process.env.FRONTEND_BASE_URL}/${fails || ""}`,
  });

  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state,
  })(req, res, next);
};

const googleLoginCallback = async (req, res) => {
  const { state } = req.query;
  console.log(`Login Redirect Urls: ${state}`);
  const { successRedirect, failureRedirect } = JSON.parse(state || "{}");

  try {
    const { accessToken, refreshToken } = generateTokens(req.user._id);
    res
      .cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: calculateExpiresInMilliseconds(
          process.env.JWT_ACCESS_TOKEN_EXPIRE
        ),
      })
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: calculateExpiresInMilliseconds(
          process.env.JWT_REFRESH_TOKEN_EXPIRE
        ),
      })
      .header("accessToken", accessToken)
      .header("refreshToken", refreshToken)
      .redirect(successRedirect);
  } catch (error) {
    res.redirect(failureRedirect);
  }
};

const getUser = asyncHandler(async (req, res) => {
  const user = req.user;
  res.json(new ApiResponse(200, "User found", user));
});

export {
  createUser,
  updateUser,
  login,
  refreshAccessToken,
  googleLoginRedirect,
  googleLoginCallback,
  getUser,
  logout,
};
