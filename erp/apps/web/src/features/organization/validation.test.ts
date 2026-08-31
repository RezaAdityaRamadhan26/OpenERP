import { describe, expect, it } from 'bun:test';
import {
  branchSchema,
  companySchema,
  costCenterSchema,
  departmentSchema,
} from './validation.js';

describe('Organization Zod validation schemas', () => {
  describe('companySchema', () => {
    it('validates a correct company input', () => {
      const valid = {
        code: 'CMP-01',
        name: 'Acme Holding',
        legal_name: 'PT Acme Holding Indonesia',
        tax_id: '01.234.567.8-901.000',
        currency: 'USD',
        timezone: 'Asia/Jakarta',
        fiscal_year_start_month: 1,
        is_active: true,
      };
      const res = companySchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it('rejects invalid currency code length and invalid characters in code', () => {
      const invalid = {
        code: 'CMP 01 spaces',
        name: 'Acme Holding',
        currency: 'USDD',
        timezone: 'UTC',
        fiscal_year_start_month: 1,
      };
      const res = companySchema.safeParse(invalid);
      expect(res.success).toBe(false);
      if (!res.success) {
        const paths = res.error.issues.map((i) => i.path[0]);
        expect(paths).toContain('code');
        expect(paths).toContain('currency');
      }
    });

    it('rejects fiscal month out of range', () => {
      const invalid = {
        code: 'CMP01',
        name: 'Acme',
        currency: 'USD',
        timezone: 'UTC',
        fiscal_year_start_month: 13,
      };
      const res = companySchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });
  });

  describe('branchSchema', () => {
    it('validates valid branch data', () => {
      const valid = {
        company_id: 'comp-uuid-123',
        code: 'BR-JKT',
        name: 'Jakarta Branch',
        email: 'jkt@example.com',
        phone: '+62215551234',
        address: 'Jl. Sudirman No 1',
        is_active: true,
      };
      const res = branchSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const invalid = {
        company_id: 'comp-uuid-123',
        code: 'BR-JKT',
        name: 'Jakarta Branch',
        email: 'not-an-email',
      };
      const res = branchSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });
  });

  describe('departmentSchema', () => {
    it('validates valid department data with parent and branch', () => {
      const valid = {
        company_id: 'comp-uuid-123',
        branch_id: 'branch-uuid-456',
        parent_id: 'dept-uuid-789',
        code: 'ENG-FE',
        name: 'Frontend Engineering',
        is_active: true,
      };
      const res = departmentSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it('fails when code or name are missing', () => {
      const invalid = {
        company_id: 'comp-uuid-123',
        code: '',
        name: '',
      };
      const res = departmentSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });
  });

  describe('costCenterSchema', () => {
    it('validates valid cost center data', () => {
      const valid = {
        company_id: 'comp-uuid-123',
        department_id: 'dept-uuid-789',
        code: 'CC-ENG-01',
        name: 'Engineering Budget',
        is_active: true,
      };
      const res = costCenterSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });
  });
});
