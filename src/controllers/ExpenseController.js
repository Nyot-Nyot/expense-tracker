import ExpenseService from "../services/ExpenseService.js";

class ExpenseController {
  async createExpense(req, res) {
    try {
      const userId = req.user.id;

      const { title, amount, category, date, ...rest } = req.body;
      const errors = [];

      if (!title || typeof title !== "string" || !title.trim()) {
        errors.push("title is required and must be a non-empty string");
      }

      const parsedAmount = Number(amount);
      if (amount === undefined || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
        errors.push("amount is required and must be a positive number");
      }

      if (!category || typeof category !== "string" || !category.trim()) {
        errors.push("category is required and must be a non-empty string");
      }

      const parsedDate = new Date(date);
      if (!date || Number.isNaN(parsedDate.getTime())) {
        errors.push("date is required and must be a valid date");
      }

      if (errors.length) {
        return res.status(400).json({ message: "Validation error", errors });
      }

      const expenseData = {
        ...rest,
        title: title.trim(),
        amount: parsedAmount,
        category: category.trim(),
        date: parsedDate.toISOString(),
        user: userId,
      };

      const expense = await ExpenseService.createExpense(expenseData);
      res.status(201).json(expense);
    } catch (error) {
      console.error("Error creating expense:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default new ExpenseController();
