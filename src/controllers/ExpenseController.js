import { expenseService as ExpenseService } from "../bootstrap.js";
import { ForbiddenError, NotFoundError } from "../errors/index.js";

class ExpenseController {
  async createExpense(req, res, next) {
    try {
      const userId = req.user.id;
      const { title, amount, category, date, ...rest } = req.body;

      const [y, m, d] = String(date).split("-").map(Number);
      const isoDate = new Date(Date.UTC(y, m - 1, d)).toISOString();

      const expenseData = {
        ...rest,
        title: title.trim(),
        amount: Number(amount),
        category: category.trim(),
        date: isoDate,
        user: userId,
      };

      const expense = await ExpenseService.createExpense(expenseData);
      res.status(201).json({ success: true, data: expense });
    } catch (error) {
      next(error);
    }
  }

  async getExpenses(req, res, next) {
    try {
      const userId = req.user.id;
      const { filter, from, to, page, limit } = req.query;

      const result = await ExpenseService.getExpensesByUser(userId, {
        filter,
        from,
        to,
        page,
        limit,
      });

      res.status(200).json({
        success: true,
        data: result.items,
        meta: {
          total: result.total,
          page: result.page,
          pageSize: result.pageSize,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateExpense(req, res, next) {
    try {
      const expenseId = req.params.id;
      const { title, amount, category, date } = req.body;

      const expense = await ExpenseService.getExpenseById(expenseId);

      if (!expense) {
        throw new NotFoundError("Expense not found");
      }

      if (expense.user.toString() !== req.user.id) {
        throw new ForbiddenError(
          "You do not have permission to update this expense",
        );
      }

      // whitelist only validated fields
      const updateData = {};

      if (title !== undefined && title !== null)
        updateData.title = title.trim();
      if (amount) updateData.amount = Number(amount);
      if (category !== undefined) updateData.category = category.trim();
      if (date !== undefined && date !== null) {
        const [y, m, d] = String(date).split("-").map(Number);
        updateData.date = new Date(Date.UTC(y, m - 1, d)).toISOString();
      }

      const updatedExpense = await ExpenseService.updateExpense(
        expenseId,
        updateData,
      );

      res.status(200).json({ success: true, data: updatedExpense });
    } catch (error) {
      next(error);
    }
  }

  async deleteExpense(req, res, next) {
    try {
      const expenseId = req.params.id;

      const expense = await ExpenseService.getExpenseById(expenseId);

      if (!expense) {
        throw new NotFoundError("Expense not found");
      }

      if (expense.user.toString() !== req.user.id) {
        throw new ForbiddenError(
          "You do not have permission to delete this expense",
        );
      }

      await ExpenseService.deleteExpense(expenseId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new ExpenseController();
