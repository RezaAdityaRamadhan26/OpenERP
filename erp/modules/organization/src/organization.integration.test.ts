import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '@open-erp/db/schema';
import {
  DrizzleOrganizationRepository,
  OrganizationService,
} from '@open-erp/organization';

const testDbUrl = process.env.TEST_DATABASE_URL;

// Gate whole suite by TEST_DATABASE_URL presence
const describeWithDb = testDbUrl ? describe : describe.skip;

describeWithDb('PostgreSQL Organization Integration Tests', () => {
  let client: ReturnType<typeof postgres>;
  let db: ReturnType<typeof drizzle<typeof schema>>;
  let repo: DrizzleOrganizationRepository;
  let service: OrganizationService;

  beforeAll(async () => {
    if (!testDbUrl) return;
    client = postgres(testDbUrl, { max: 1 });
    db = drizzle(client, { schema });
    repo = new DrizzleOrganizationRepository(db);
    service = new OrganizationService(repo);
  });

  afterAll(async () => {
    if (client) {
      await client.end();
    }
  });

  test('creates company, branch, department, cost center in real PostgreSQL', async () => {
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const companyCode = `COMP_${randomSuffix}`;

    // 1. Create Company
    const company = await service.createCompany({
      code: companyCode,
      name: `Test Company ${randomSuffix}`,
    });
    expect(company.id).toBeDefined();
    expect(company.code).toBe(companyCode);

    // 2. Create Branch
    const branch = await service.createBranch({
      companyId: company.id,
      code: `BR_${randomSuffix}`,
      name: 'Main Branch',
    });
    expect(branch.id).toBeDefined();
    expect(branch.companyId).toBe(company.id);

    // 3. Create Department
    const department = await service.createDepartment({
      companyId: company.id,
      code: `DEP_${randomSuffix}`,
      name: 'Finance',
    });
    expect(department.id).toBeDefined();

    // 4. Create Cost Center
    const costCenter = await service.createCostCenter({
      companyId: company.id,
      code: `CC_${randomSuffix}`,
      name: 'Operations CC',
    });
    expect(costCenter.id).toBeDefined();

    // 5. Scoped listings
    const branchList = await service.listBranches(company.id);
    expect(branchList.total).toBeGreaterThanOrEqual(1);

    const deptList = await service.listDepartments(company.id);
    expect(deptList.total).toBeGreaterThanOrEqual(1);

    const ccList = await service.listCostCenters(company.id);
    expect(ccList.total).toBeGreaterThanOrEqual(1);
  });
});
