import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthenticationError, ConflictError } from "../errors/index.js";

export default class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register(userData) {
    const { email, password } = userData;
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictError("Email already in use");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await this.userRepository.createUser({
      email,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = newUser.toObject();
    return userWithoutPassword;
  }

  async login(email, password) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new AuthenticationError("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid email or password");
    }

    // create jwt token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      },
    );

    const { password: _, ...userWithoutPassword } = user.toObject();
    return { ...userWithoutPassword, token };
  }
}
