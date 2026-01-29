import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./src/config/db.js";
import errorHandler from "./src/middlewares/errorHandler.js";
import { globalLimiter } from "./src/middlewares/RateLimiter.js";
import AuthRoutes from "./src/routes/AuthRoutes.js";
import ExpenseRoutes from "./src/routes/ExpenseRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// If running behind a proxy (e.g., Heroku, Nginx), trust the first proxy so req.ip/X-Forwarded-For work
app.set("trust proxy", 1);

// Ensure required env vars exist
const requiredEnvs = ["MONGO_URI", "JWT_SECRET"];
const missing = requiredEnvs.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing required env vars: ${missing.join(", ")}`);
  process.exit(1);
}

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Apply a global basic rate limiter
app.use(globalLimiter);

// Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/expenses", ExpenseRoutes);

// Global error handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
