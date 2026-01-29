import express from "express";
import AuthController from "../controllers/AuthController.js";
import { authLimiter } from "../middlewares/RateLimiter.js";
import {
  loginRules,
  registerRules,
  validate,
} from "../middlewares/validators.js";

const router = express.Router();

router.post(
  "/register",
  authLimiter,
  registerRules,
  validate,
  AuthController.register,
);
router.post("/login", authLimiter, loginRules, validate, AuthController.login);

export default router;
