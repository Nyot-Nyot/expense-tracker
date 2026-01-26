import express from "express";
import AuthController from "../controllers/AuthController.js";
import {
  loginRules,
  registerRules,
  validate,
} from "../middlewares/validators.js";

const router = express.Router();

router.post("/register", registerRules, validate, AuthController.register);
router.post("/login", loginRules, validate, AuthController.login);

export default router;
