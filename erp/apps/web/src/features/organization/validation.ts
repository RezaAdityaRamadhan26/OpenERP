import { z } from 'zod';

const codeSchema = z
  .string()
  .trim()
  .min(1, 'Code is required')
  .max(64, 'Code must be 64 characters or less')
  .regex(/^[A-Z0-9_-]+$/i, 'Use letters, numbers, hyphens, or underscores');

const nameSchema = z.string().trim().min(1, 'Name is required').max(255);

export const companySchema = z.object({
  code: codeSchema,
  name: nameSchema,
});

export const scopedEntitySchema = z.object({
  code: codeSchema,
  name: nameSchema,
});

export type CompanyFormData = z.infer<typeof companySchema>;
export type ScopedEntityFormData = z.infer<typeof scopedEntitySchema>;
