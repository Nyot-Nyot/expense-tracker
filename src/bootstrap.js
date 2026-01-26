import ExpenseRepository from "./repositories/ExpenseRepository.js";
import UserRepository from "./repositories/UserRepository.js";
import AuthService from "./services/AuthService.js";
import ExpenseService from "./services/ExpenseService.js";

export const authService = new AuthService(UserRepository);
export const expenseService = new ExpenseService(ExpenseRepository);

export default { authService, expenseService };
