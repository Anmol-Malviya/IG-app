import { User } from "../user/user.model";
import { AppError } from "../../shared/errors/AppError";
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../shared/utils/crypto";
import { RegisterInput, LoginInput } from "./auth.validation";
import { AuthTokens, LoginResponse } from "./auth.types";

/**
 * Auth service — business logic for authentication operations.
 */
export class AuthService {
  /**
   * Register a new user.
   */
  static async register(data: RegisterInput): Promise<LoginResponse> {
    // Check if email already exists
    const existingUser = await User.findOne({
      email: data.email.toLowerCase(),
    });
    if (existingUser) {
      throw AppError.conflict("Email already registered");
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(data.password);
    const user = await User.create({
      ...data,
      email: data.email.toLowerCase(),
      password: hashedPassword,
    });

    // Generate tokens
    const tokens = AuthService.generateTokenPair(
      user._id.toString(),
      user.email,
      user.role,
      user.tenantId?.toString()
    );

    return {
      user: {
        _id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      tokens,
    };
  }

  /**
   * Login with email and password.
   */
  static async login(data: LoginInput): Promise<LoginResponse> {
    // Find user with password field
    const user = await User.findOne({
      email: data.email.toLowerCase(),
    }).select("+password");

    if (!user) {
      throw AppError.unauthorized("Invalid email or password");
    }

    if (!user.isActive) {
      throw AppError.forbidden("Account has been deactivated");
    }

    // Verify password
    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw AppError.unauthorized("Invalid email or password");
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const tokens = AuthService.generateTokenPair(
      user._id.toString(),
      user.email,
      user.role,
      user.tenantId?.toString()
    );

    return {
      user: {
        _id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      tokens,
    };
  }

  /**
   * Refresh access token using a valid refresh token.
   */
  static async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const decoded = verifyRefreshToken(refreshToken);

      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        throw AppError.unauthorized("User not found or deactivated");
      }

      return AuthService.generateTokenPair(
        user._id.toString(),
        user.email,
        user.role,
        user.tenantId?.toString()
      );
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.unauthorized("Invalid refresh token");
    }
  }

  /**
   * Generate access + refresh token pair.
   */
  private static generateTokenPair(
    userId: string,
    email: string,
    role: string,
    tenantId?: string
  ): AuthTokens {
    const accessToken = generateAccessToken({
      userId,
      email,
      role: role as "superadmin" | "admin" | "user",
      tenantId,
    });

    const refreshToken = generateRefreshToken({ userId });

    return { accessToken, refreshToken };
  }
}
