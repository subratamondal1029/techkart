import { Router } from "express";
import {
  createUser,
  login,
  getUser,
  logout,
  refreshAccessToken,
  googleLoginRedirect,
  googleLoginCallback,
  updateUser,
  forgetPassword,
} from "../controllers/users.controllers.js";
import verifyUser from "../middlewares/verifyUser.middleware.js";
import rateLimiter from "../middlewares/rateLimiter.middleware.js";
import passport from "passport";

const router = Router();

router
  .route("/")
  .post(createUser)
  .get(verifyUser(), getUser)
  .patch(verifyUser(), updateUser);
router.post("/auth/login", login);
router.post("/auth/refresh-tokens", refreshAccessToken);
router.delete("/auth/logout", verifyUser(), logout);
router.get("/auth/google", googleLoginRedirect);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  googleLoginCallback
);

// router.post("/auth/forget-password", rateLimiter(1), forgetPassword);
router.post("/auth/forget-password", forgetPassword);
// TODO: add verify token route

export default router;
