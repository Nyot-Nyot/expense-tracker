import Expense from "../models/Expense.js";

class ExpenseRepository {
  async createExpense(expenseData) {
    const expense = new Expense(expenseData);
    return await expense.save();
  }

  async getExpenseById(id) {
    return await Expense.findById(id);
  }

  async findAllUserExpenses(criteria, options = {}) {
    const DEFAULT_LIMIT = 50;
    const MAX_LIMIT = 100;

    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.min(Number(options.limit) || DEFAULT_LIMIT, MAX_LIMIT);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Expense.find(criteria).sort({ date: -1 }).skip(skip).limit(limit).exec(),
      Expense.countDocuments(criteria).exec(),
    ]);

    return {
      items,
      total,
      page,
      pageSize: limit,
    };
  }

  async updateExpense(id, updateData) {
    return await Expense.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteExpense(id) {
    return await Expense.findByIdAndDelete(id);
  }
}

export default new ExpenseRepository();
