import { z } from "zod";

export const createTenantSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  domain: z.string().optional(),
  plan: z.enum(["free", "starter", "pro", "enterprise"]).optional(),
  settings: z
    .object({
      maxUsers: z.number().min(1).max(10000).optional(),
      features: z.array(z.string()).optional(),
    })
    .optional(),
});

export const updateTenantSchema = createTenantSchema.partial();

export const getTenantByIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid tenant ID"),
});

export type CreateTenantInput = z.infer<typeof createTenantSchema>;
export type UpdateTenantInput = z.infer<typeof updateTenantSchema>;
