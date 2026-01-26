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

function validateYMD(value) {
  // Accept only YYYY-MM-DD and ensure it's a valid calendar date
  const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) {
    throw new Error("date must be in YYYY-MM-DD format");
  }

  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);

  const dt = new Date(Date.UTC(year, month - 1, day));
  if (
    dt.getUTCFullYear() !== year ||
    dt.getUTCMonth() + 1 !== month ||
    dt.getUTCDate() !== day
  ) {
    throw new Error("date is not a valid calendar date");
  }

  return true;
}

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
  body("date").custom((v) => validateYMD(v)),
];

export const getExpensesRules = [
  query("page").optional().isInt({ min: 1 }).withMessage("page must be >= 1"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be between 1 and 100"),
  query("filter").optional().isString().isLength({ max: 50 }),
  query("from")
    .optional()
    .custom((v) => validateYMD(v)),
  query("to")
    .optional()
    .custom((v) => validateYMD(v)),
];

export const updateExpenseRules = [
  body("title")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("title must be a non-empty string"),
  body("amount")
    .optional()
    .isNumeric()
    .custom((v) => v > 0)
    .withMessage("amount must be a positive number"),
  body("category")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("category must be a non-empty string"),
  body("date")
    .optional()
    .custom((v) => validateYMD(v)),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError("Validation failed", { errors: errors.array() });
  }
  next();
};
