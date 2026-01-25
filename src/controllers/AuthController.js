import AuthService from "../services/AuthService.js";

class AuthController {
  async register(req, res) {
    try {
      const { email, password } = req.body || {};

      // Basic input validation and whitelisting
      if (typeof email !== "string" || typeof password !== "string") {
        return res
          .status(400)
          .json({
            message:
              "Invalid registration data: email and password are required.",
          });
      }

      const userData = { email, password };
      const newUser = await AuthService.register(userData);
      res.status(201).json(newUser);
    } catch (error) {
      let statusCode = 500;

      // Conflict: e.g., "Email already in use"
      if (
        typeof error.message === "string" &&
        error.message.toLowerCase().includes("already in use")
      ) {
        statusCode = 409;
      }
      // Validation errors
      else if (error.name === "ValidationError") {
        statusCode = 400;
      }

      res.status(statusCode).json({ message: error.message });
    }
  }
}

export default new AuthController();
