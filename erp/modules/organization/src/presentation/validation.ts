import { z } from 'zod';

export const createCompanySchema = z.object({
  code: z.string().min(1, 'Company code is required').max(64),
  name: z.string().min(1, 'Company name is required').max(255),
  isActive: z.boolean().optional(),
});

export const updateCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required').max(255).optional(),
  isActive: z.boolean().optional(),
});

export const createScopedEntitySchema = z.object({
  code: z.string().min(1, 'Code is required').max(64),
  name: z.string().min(1, 'Name is required').max(255),
  isActive: z.boolean().optional(),
});

export const updateScopedEntitySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255).optional(),
  isActive: z.boolean().optional(),
});

export const listQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional().default(50),
  offset: z.coerce.number().int().min(0).optional().default(0),
  includeInactive: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true'),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
export type CreateScopedEntityInput = z.infer<typeof createScopedEntitySchema>;
export type UpdateScopedEntityInput = z.infer<typeof updateScopedEntitySchema>;
export type ListQueryInput = z.infer<typeof listQuerySchema>;
