import { z } from 'zod';

export const companySchema = z.object({
  code: z
    .string()
    .min(1, 'Company code is required')
    .max(32, 'Company code must be 32 characters or less')
    .regex(/^[A-Z0-9_-]+$/i, 'Only letters, numbers, hyphens and underscores allowed'),
  name: z.string().min(1, 'Company name is required').max(255, 'Company name must be 255 characters or less'),
  legal_name: z.string().max(255, 'Legal name must be 255 characters or less').optional().or(z.literal('')),
  tax_id: z.string().max(64, 'Tax ID must be 64 characters or less').optional().or(z.literal('')),
  currency: z
    .string()
    .min(3, 'Currency must be 3-letter ISO code')
    .max(3, 'Currency must be 3-letter ISO code')
    .toUpperCase(),
  timezone: z.string().min(1, 'Timezone is required'),
  fiscal_year_start_month: z.coerce.number().int().min(1).max(12),
  is_active: z.boolean().default(true),
});

export type CompanyFormData = z.infer<typeof companySchema>;

export const branchSchema = z.object({
  company_id: z.string().min(1, 'Company is required'),
  code: z
    .string()
    .min(1, 'Branch code is required')
    .max(32, 'Branch code must be 32 characters or less')
    .regex(/^[A-Z0-9_-]+$/i, 'Only letters, numbers, hyphens and underscores allowed'),
  name: z.string().min(1, 'Branch name is required').max(255, 'Branch name must be 255 characters or less'),
  address: z.string().max(500, 'Address must be 500 characters or less').optional().or(z.literal('')),
  phone: z.string().max(32, 'Phone must be 32 characters or less').optional().or(z.literal('')),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  is_active: z.boolean().default(true),
});

export type BranchFormData = z.infer<typeof branchSchema>;

export const departmentSchema = z.object({
  company_id: z.string().min(1, 'Company is required'),
  branch_id: z.string().optional().or(z.literal('')),
  parent_id: z.string().optional().or(z.literal('')),
  code: z
    .string()
    .min(1, 'Department code is required')
    .max(32, 'Department code must be 32 characters or less')
    .regex(/^[A-Z0-9_-]+$/i, 'Only letters, numbers, hyphens and underscores allowed'),
  name: z.string().min(1, 'Department name is required').max(255, 'Department name must be 255 characters or less'),
  is_active: z.boolean().default(true),
});

export type DepartmentFormData = z.infer<typeof departmentSchema>;

export const costCenterSchema = z.object({
  company_id: z.string().min(1, 'Company is required'),
  department_id: z.string().optional().or(z.literal('')),
  code: z
    .string()
    .min(1, 'Cost center code is required')
    .max(32, 'Cost center code must be 32 characters or less')
    .regex(/^[A-Z0-9_-]+$/i, 'Only letters, numbers, hyphens and underscores allowed'),
  name: z.string().min(1, 'Cost center name is required').max(255, 'Cost center name must be 255 characters or less'),
  is_active: z.boolean().default(true),
});

export type CostCenterFormData = z.infer<typeof costCenterSchema>;
