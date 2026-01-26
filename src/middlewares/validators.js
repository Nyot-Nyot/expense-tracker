import { body, query, validationResult } from "express-validator";
import { ValidationError } from "../errors/index.js";

export const registerRules = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const loginRules = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password").isString().withMessage("Password is required"),
];

export const createExpenseRules = [
  body("title").isString().trim().notEmpty().withMessage("title is required"),
  body("amount")
    .isNumeric()
    .custom((v) => v > 0)
    .withMessage("amount must be a positive number"),
  body("category")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("category is required"),
  body("date")
    .isISO8601()
    .withMessage("date must be a valid ISO8601 date string"),
];

export const getExpensesRules = [
  query("page").optional().isInt({ min: 1 }).withMessage("page must be >= 1"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be between 1 and 100"),
  query("filter").optional().isString().isLength({ max: 50 }),
  query("from").optional().isISO8601().withMessage("from must be a valid date"),
  query("to").optional().isISO8601().withMessage("to must be a valid date"),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError("Validation failed", { errors: errors.array() });
  }
  next();
};
