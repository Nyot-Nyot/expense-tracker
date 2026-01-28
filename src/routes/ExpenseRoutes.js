import express from "express";
import ExpenseController from "../controllers/ExpenseController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
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
router.put(
  "/:id",
  AuthMiddleware.authenticate,
  updateExpenseRules,
  validate,
  ExpenseController.updateExpense,
);
router.delete(
  "/:id",
  AuthMiddleware.authenticate,
  ExpenseController.deleteExpense,
);

export default router;
