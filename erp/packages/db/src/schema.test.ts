import { describe, expect, test } from 'bun:test';
import { schema } from './index.js';

describe('Database schema definitions', () => {
  test('exports organization tables with expected structure', () => {
    expect(schema.companies).toBeDefined();
    expect(schema.branches).toBeDefined();
    expect(schema.departments).toBeDefined();
    expect(schema.costCenters).toBeDefined();
    expect(schema.migrationsCheck).toBeDefined();
  });
});
