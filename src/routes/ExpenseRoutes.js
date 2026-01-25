import express from "express";
import ExpenseController from "../controllers/ExpenseController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/", AuthMiddleware.authenticate, ExpenseController.createExpense);

export default router;
