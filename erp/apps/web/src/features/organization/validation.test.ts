import { describe, expect, it } from 'bun:test';
import {
  companySchema,
  scopedEntitySchema,
} from './validation.js';

describe('Organization Zod validation schemas', () => {
  describe('companySchema', () => {
    it('validates a correct company input', () => {
      const valid = {
        code: 'CMP-01',
        name: 'Acme Holding',
      };
      const res = companySchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it('rejects invalid characters in code', () => {
      const invalid = {
        code: 'CMP 01 spaces',
        name: 'Acme Holding',
      };
      const res = companySchema.safeParse(invalid);
      expect(res.success).toBe(false);
      if (!res.success) {
        const paths = res.error.issues.map((i) => i.path[0]);
        expect(paths).toContain('code');
      }
    });
  });

  describe('scopedEntitySchema', () => {
    it('validates valid scoped entity data', () => {
      const valid = {
        code: 'BR-JKT',
        name: 'Jakarta Branch',
      };
      const res = scopedEntitySchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it('fails when code or name are missing', () => {
      const invalid = {
        code: '',
        name: '',
      };
      const res = scopedEntitySchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });
  });
});
