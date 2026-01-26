import ExpenseRepository from "../repositories/ExpenseRepository.js";

class ExpenseService {
  async createExpense(expenseData) {
    return await ExpenseRepository.createExpense(expenseData);
  }

  async getExpensesByUser(userId, query = {}) {
    const { filter, from, to } = query;
    let dateFilter = {};

    const now = new Date();
    const normalizedFilter = filter
      ? String(filter).trim().toLowerCase()
      : undefined;

    if (normalizedFilter === "past-week") {
      const pastWeek = new Date(now);
      pastWeek.setDate(now.getDate() - 7);
      dateFilter = { date: { $gte: pastWeek, $lte: now } };
    } else if (normalizedFilter === "past-month") {
      const pastMonth = new Date(now);
      pastMonth.setMonth(now.getMonth() - 1);
      dateFilter = { date: { $gte: pastMonth, $lte: now } };
    } else {
      // support patterns like `past-3-month` and `past-3-months` (and other numeric month variants)
      const monthsMatch =
        normalizedFilter && normalizedFilter.match(/^past-(\d+)-months?$/);
      if (monthsMatch) {
        const months = Number(monthsMatch[1]);
        if (!Number.isNaN(months) && months > 0) {
          const pastNMonths = new Date(now);
          pastNMonths.setMonth(now.getMonth() - months);
          dateFilter = { date: { $gte: pastNMonths, $lte: now } };
        }
      } else {
        let fromDate;
        let toDate;

        if (from) {
          fromDate = new Date(from);
          if (isNaN(fromDate.getTime())) {
            fromDate = undefined;
          } else {
            // normalize to start of day
            fromDate.setHours(0, 0, 0, 0);
          }
        }

        if (to) {
          toDate = new Date(to);
          if (isNaN(toDate.getTime())) {
            toDate = undefined;
          } else {
            // normalize to end of day
            toDate.setHours(23, 59, 59, 999);
          }
        }

        if (fromDate && toDate) {
          dateFilter = { date: { $gte: fromDate, $lte: toDate } };
        } else if (fromDate) {
          dateFilter = { date: { $gte: fromDate } };
        } else if (toDate) {
          dateFilter = { date: { $lte: toDate } };
        }
      }
    }

    const criteria = { user: userId, ...dateFilter };
    return await ExpenseRepository.findAllUserExpenses(criteria);
  }

  async updateExpense(id, updateData) {
    return await ExpenseRepository.updateExpense(id, updateData);
  }

  async deleteExpense(id) {
    return await ExpenseRepository.deleteExpense(id);
  }
}

export default new ExpenseService();
