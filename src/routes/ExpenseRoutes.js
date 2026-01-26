import express from "express";
import ExpenseController from "../controllers/ExpenseController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import {
  createExpenseRules,
  getExpensesRules,
  validate,
} from "../middlewares/validators.js";

const router = express.Router();

router.post(
  "/",
  AuthMiddleware.authenticate,
  createExpenseRules,
  validate,
  ExpenseController.createExpense,
);
router.get(
  "/",
  AuthMiddleware.authenticate,
  getExpensesRules,
  validate,
  ExpenseController.getExpenses,
);

export default router;
