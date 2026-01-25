import Expense from "../models/Expense.js";

class ExpenseRepository {
  async createExpense(expenseData) {
    const expense = new Expense(expenseData);
    return await expense.save();
  }

  async findAllExpenses() {
    return await Expense.find();
  }

  async findExpenseById(id) {
    return await Expense.findById(id);
  }

  async findExpensesByUser(userId) {
    return await Expense.find({ user: userId });
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
