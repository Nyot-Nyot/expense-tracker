import ExpenseRepository from "../repositories/ExpenseRepository.js";

class ExpenseService {
  async createExpense(expenseData) {
    return await ExpenseRepository.createExpense(expenseData);
  }

  async getAllExpenses() {
    return await ExpenseRepository.findAllExpenses();
  }

  async getExpenseById(id) {
    return await ExpenseRepository.findExpenseById(id);
  }

  async getExpensesByUser(userId) {
    return await ExpenseRepository.findExpensesByUser(userId);
  }

  async updateExpense(id, updateData) {
    return await ExpenseRepository.updateExpense(id, updateData);
  }

  async deleteExpense(id) {
    return await ExpenseRepository.deleteExpense(id);
  }
}

export default new ExpenseService();
