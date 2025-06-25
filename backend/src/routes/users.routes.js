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
  verifyToken,
  updatePassword,
} from "../controllers/users.controllers.js";
import verifyUser from "../middlewares/verifyUser.middleware.js";
import rateLimiter from "../middlewares/rateLimiter.middleware.js";
import passport from "passport";

const router = Router();

router
  .route("/")
  .post(rateLimiter(5), verifyUser(false), createUser)
  .get(rateLimiter(20), verifyUser(), getUser)
  .patch(rateLimiter(5), verifyUser(), updateUser);
router.post("/auth/login", rateLimiter(5), login);
router.post("/auth/refresh-tokens", rateLimiter(5), refreshAccessToken);
router.delete("/auth/logout", rateLimiter(5), verifyUser(), logout);
router.get("/auth/google", rateLimiter(5), googleLoginRedirect);
router.get(
  "/auth/google/callback",
  rateLimiter(5),
  passport.authenticate("google", {
    session: false,
  }),
  googleLoginCallback
);

router.post("/auth/forget-password", rateLimiter(1), forgetPassword);
router.post("/auth/verify-token/:token", rateLimiter(5), verifyToken);
router.patch(
  "/auth/update-password",
  rateLimiter(5),
  verifyUser(false),
  updatePassword
);

export default router;
