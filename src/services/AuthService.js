import bcrypt from "bcryptjs";
import UserRepository from "../repositories/UserRepository.js";

class AuthService {
  async register(userData) {
    const { email, password } = userData;
    const existingUser = await UserRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error("Email already in use");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await UserRepository.createUser({
      email,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = newUser.toObject();
    return userWithoutPassword;
  }
}

export default new AuthService();
