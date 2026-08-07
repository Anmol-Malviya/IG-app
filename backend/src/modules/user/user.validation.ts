import { z } from "zod";

/**
 * Zod validation schemas for user-related requests.
 */

export const updateUserSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  email: z.string().email().optional(),
});

export const getUserByIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid user ID"),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type GetUserByIdInput = z.infer<typeof getUserByIdSchema>;
