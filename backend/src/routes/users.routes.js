import { Router } from "express";
import {
  createUser,
  login,
  getUser,
  logout,
  refreshAccessToken,
  googleLoginRedirect,
  googleLoginCallback,
} from "../controllers/users.controllers.js";
import passport from "passport";

const router = Router();

router.route("/").post(createUser).get(getUser);
router.post("/auth/login", login);
router.post("/auth/refresh-tokens", refreshAccessToken);
router.delete("/auth/logout", logout);
router.get("/auth/google", googleLoginRedirect);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  googleLoginCallback
);

export default router;
