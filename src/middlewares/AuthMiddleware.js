import jwt from "jsonwebtoken";
import UserRepository from "../repositories/UserRepository.js";

class AuthMiddleware {
  async authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (
        !decoded ||
        typeof decoded !== "object" ||
        decoded === null ||
        !Object.prototype.hasOwnProperty.call(decoded, "id") ||
        (typeof decoded.id !== "string" && typeof decoded.id !== "number")
      ) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = decoded.id;
      const user = await UserRepository.findUserById(userId);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.user = user; // Attach user to request object
      next();
    } catch (error) {
      console.error("JWT authentication error:", error);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }
}

export default new AuthMiddleware();
