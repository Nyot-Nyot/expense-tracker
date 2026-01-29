import express from "express";
import ExpenseController from "../controllers/ExpenseController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import RateLimiter from "../middlewares/RateLimiter.js";
import {
  createExpenseRules,
  getExpensesRules,
  updateExpenseRules,
  validate,
} from "../middlewares/validators.js";

const router = express.Router();

router.post(
  "/",
  AuthMiddleware.authenticate,
  RateLimiter,
  createExpenseRules,
  validate,
  ExpenseController.createExpense,
);
router.get(
  "/",
  AuthMiddleware.authenticate,
  RateLimiter,
  getExpensesRules,
  validate,
  ExpenseController.getExpenses,
);
router.put(
  "/:id",
  AuthMiddleware.authenticate,
  RateLimiter,
  updateExpenseRules,
  validate,
  ExpenseController.updateExpense,
);
router.delete(
  "/:id",
  AuthMiddleware.authenticate,
  RateLimiter,
  ExpenseController.deleteExpense,
);

export default router;
