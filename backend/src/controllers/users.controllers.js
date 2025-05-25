import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import User from "../models/user.model.js";
import File from "../models/file.model.js";
import jwt from "jsonwebtoken";
import { generateTokens } from "../utils/jwt.js";
import passport from "../config/passport.js";
import crypto from "crypto";
import sendMail from "../utils/sendMail.js";
import redisClient from "../db/redis.db.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

const calculateExpiresInMilliseconds = (day) => {
  return day?.split("d")?.[0] * 24 * 60 * 60 * 1000;
};

const createUser = asyncHandler(async (req, res) => {
  let { name, email, password, label } = req.body;

  if (!name?.trim() || !email?.trim() || !password || !label?.trim()) {
    throw new ApiError(400, "All fields are required");
  }

  name = name.trim();
  email = email.trim().toLowerCase();

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    throw new ApiError(400, "Invalid email");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    label,
    provider: "local",
  });

  if (!user) {
    throw new ApiError(500, "Failed to create user");
  }

  res.status(201).json(new ApiResponse(201, "User created", user));
});

const updateUser = asyncHandler(async (req, res) => {
  let { name, email, avatar } = req.body;

  if (!name?.trim() && !email?.trim() && !avatar?.trim())
    throw new ApiError(400, "At least One field is required");

  if (avatar?.trim()) {
    const isAvatarExist = File.findById(avatar);
    if (!isAvatarExist) throw new ApiError(400, "Invalid Avatar Id");
    req.user.avatar = avatar;
  }

  if (name?.trim()) req.user.name = name.trim();
  if (email?.trim()) {
    email = email.trim().toLowerCase();
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
      throw new ApiError(400, "Invalid email");
    req.user.email = email;
  }

  await req.user.save();

  res.json(new ApiResponse(200, "User Details Updated", req.user));
});

const login = asyncHandler(async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid email Cannot find user");
  }

  if (user.provider !== "local") {
    throw new ApiError(
      401,
      "User is not Available, try to login with external provider."
    );
  }

  const isMatched = await user.comparePassword(password);

  if (!isMatched) {
    throw new ApiError(401, "Wrong password");
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
    req.headers?.["x-refresh-token"];

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
    .cookie("refreshToken", newRefreshToken, {
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
    const { accessToken, refreshToken } = await generateTokens(req.user._id);

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
  res
    .header("x-access-token", req.token)
    .json(new ApiResponse(200, "User found", user));
});

const generateToken = async (length = 6) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.randomBytes(length);

  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars[bytes[i] % chars.length];
  }

  const tokenExists = await redisClient.exists(token);

  if (tokenExists) {
    return generateToken();
  }

  return token;
};

const saveToken = async (userId, token) => {
  const oldToken = await redisClient.get(`otp:user:${userId}`);

  if (oldToken) {
    await redisClient.del(`otp:user:${userId}`);
    await redisClient.del(`otp:token:${oldToken}`);
  }

  await redisClient.set(`otp:user:${userId}`, token, { EX: 15 * 60 });
  await redisClient.set(`otp:token:${token}`, userId, { EX: 15 * 60 });
  await redisClient.set(`otp:cooldown:${userId}`, 1, { EX: 60 });
};

const deleteToken = async (userId, token) => {
  await redisClient.del(`otp:user:${userId}`);
  await redisClient.del(`otp:token:${token}`);
};

const forgetPassword = asyncHandler(async (req, res) => {
  const { email, route } = req.body;

  if (!email) throw new ApiError(400, "email is required");
  if (!route) throw new ApiError(400, "route is required");

  const user = await User.findOne({ email, provider: "local" });
  if (!user) throw new ApiError(404, "User not found");

  const cooldown = await redisClient.get(`otp:cooldown:${user._id.toString()}`);
  if (cooldown) throw new ApiError(429, "Too many requests");

  const token = await generateToken();
  await saveToken(user._id.toString(), token);

  let resetRoute;
  if (route.includes(":token")) {
    resetRoute = route.replace(":token", token);
  } else if (route.includes("?token=")) {
    resetRoute = route.replace("?token=", `?token=${token}`);
  }

  const resetPasswordTemplate = `<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; color: #333;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 5px rgba(0,0,0,0.1);">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="${req.protocol}://${req.get(
    "host"
  )}/api/v1/files/67eeb1fcfaf070cbfb48da8c" alt="Company Logo" style="max-height: 60px;" />
    </div>
    <h2 style="margin-top: 0;">Reset Your Password</h2>
    <p>Hello,</p>
    <p>We received a request to reset your password. Click the button below to reset it:</p>
    <p>
      <a href="${process.env.FRONTEND_BASE_URL}/${resetRoute}" target="_blank"
         style="display: inline-block; margin-top: 20px; padding: 12px 20px; background: #007bff; color: #ffffff; text-decoration: none; border-radius: 4px;">
        Reset Password
      </a>
    </p>
    <p>Or copy and paste the link below into your browser:</p>
    <p>
      <a href="${process.env.FRONTEND_BASE_URL}/${resetRoute}" target="_blank"
         style="display: inline-block; margin-top: 20px; color: #007bff; text-decoration: none;">
        ${process.env.FRONTEND_BASE_URL}/${resetRoute}
      </a>
    </p>

    <p>This link will expire in 15 minutes.</p>
    <p>If you didn't request a password reset, you can contact us at ${
      process.env.CONTACT_EMAIL
    }.</p>
    <div style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">
      &copy; 2025 Techkart. All rights reserved.
    </div>
  </div>
</body>`;

  await sendMail({
    body: resetPasswordTemplate,
    subject: "Reset Your Password",
    receivers: email,
  });

  res.json(new ApiResponse(200, "Password reset link sent"));
});

const verifyToken = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const userId = await redisClient.get(`otp:token:${token}`);
  if (!userId) throw new ApiError(400, "Invalid or expired token");

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  res.json(new ApiResponse(200, "User Verified"));
});

const updatePassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!req.user) {
    if (!token) throw new ApiError(400, "Token is required");

    const userId = await redisClient.get(`otp:token:${token}`);
    if (!userId) throw new ApiError(400, "Invalid or expired token");

    const user = await User.findById(userId);

    if (!user) throw new ApiError(404, "User not found");
    req.user = user;
  }

  if (await req.user.comparePassword(password)) {
    throw new ApiError(422, "Password cannot be same as old password");
  }
  req.user.password = password;
  await req.user.save();

  await deleteToken(req.user._id.toString(), token);

  const passwordResetTemplate = `<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; color: #333;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 5px rgba(0,0,0,0.1);">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="${req.protocol}://${req.get(
    "host"
  )}/api/v1/files/67eeb1fcfaf070cbfb48da8c" alt="Company Logo" style="max-height: 60px;" />
    </div>
    <h2 style="margin-top: 0;">Password Reset</h2>
    <p>Hello ${req.user.name},</p>
    <p>Your password has been successfully reset.</p>
    <p>Thank you for using our service.</p>
    <div style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">
      &copy; 2025 Techkart. All rights reserved.
    </div>
  </div>
</body>`;

  sendMail({
    body: passwordResetTemplate,
    subject: "Password Reset",
    receivers: req.user.email,
  });

  res.json(new ApiResponse(200, "Password updated"));
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
  forgetPassword,
  verifyToken,
  updatePassword,
};
