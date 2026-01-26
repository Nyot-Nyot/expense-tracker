import Expense from "../models/Expense.js";

class ExpenseRepository {
  async createExpense(expenseData) {
    const expense = new Expense(expenseData);
    return await expense.save();
  }

  async findAllUserExpenses(criteria) {
    return await Expense.find(criteria).sort({ date: -1 });
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
