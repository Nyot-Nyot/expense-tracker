import { expenseService as ExpenseService } from "../bootstrap.js";

class ExpenseController {
  async createExpense(req, res, next) {
    try {
      const userId = req.user.id;
      const { title, amount, category, date, ...rest } = req.body;

      const expenseData = {
        ...rest,
        title: title.trim(),
        amount: Number(amount),
        category: category.trim(),
        date: new Date(date).toISOString(),
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

      res
        .status(200)
        .json({
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
}

export default new ExpenseController();
