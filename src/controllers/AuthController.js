import { authService as AuthService } from "../bootstrap.js";
import { ValidationError } from "../errors/index.js";

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password } = req.body || {};

      // Basic input validation and whitelisting
      if (typeof email !== "string" || typeof password !== "string") {
        throw new ValidationError(
          "Invalid registration data: email and password are required.",
        );
      }

      const userData = { email, password };
      const newUser = await AuthService.register(userData);
      res.status(201).json({ success: true, data: newUser });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body || {};

      // Basic input validation and whitelisting
      if (typeof email !== "string" || typeof password !== "string") {
        throw new ValidationError(
          "Invalid login data: email and password are required.",
        );
      }

      const result = await AuthService.login(email, password);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
