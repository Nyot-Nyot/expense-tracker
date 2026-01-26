export default class ExpenseService {
  constructor(expenseRepository) {
    this.expenseRepository = expenseRepository;
  }

  async createExpense(expenseData) {
    return await this.expenseRepository.createExpense(expenseData);
  }

  async getExpenseById(expenseId) {
    return await this.expenseRepository.getExpenseById(expenseId);
  }

  async getExpensesByUser(userId, query = {}) {
    const { filter, from, to, page, limit } = query;
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
          const m = String(from).match(/^(\d{4})-(\d{2})-(\d{2})$/);
          if (!m) {
            fromDate = undefined;
          } else {
            const year = Number(m[1]);
            const month = Number(m[2]);
            const day = Number(m[3]);
            const dt = new Date(Date.UTC(year, month - 1, day));
            if (isNaN(dt.getTime())) {
              fromDate = undefined;
            } else {
              fromDate = dt; // UTC midnight
            }
          }
        }

        if (to) {
          const m = String(to).match(/^(\d{4})-(\d{2})-(\d{2})$/);
          if (!m) {
            toDate = undefined;
          } else {
            const year = Number(m[1]);
            const month = Number(m[2]);
            const day = Number(m[3]);
            const dt = new Date(Date.UTC(year, month - 1, day));
            if (isNaN(dt.getTime())) {
              toDate = undefined;
            } else {
              dt.setUTCHours(23, 59, 59, 999);
              toDate = dt;
            }
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
    return await this.expenseRepository.findAllUserExpenses(criteria, {
      page,
      limit,
    });
  }

  async updateExpense(expenseId, updateData) {
    return await this.expenseRepository.updateExpense(expenseId, updateData);
  }

  async deleteExpense(expenseId) {
    return await this.expenseRepository.deleteExpense(expenseId);
  }
}
