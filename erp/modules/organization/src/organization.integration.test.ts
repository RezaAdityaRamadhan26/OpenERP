import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { inArray } from 'drizzle-orm';
import * as schema from '@open-erp/db/schema';
import {
  DuplicateCodeError,
  DrizzleOrganizationRepository,
  InvalidParentCompanyError,
  OrganizationNotFoundError,
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
  const createdCompanyIds: string[] = [];

  beforeAll(async () => {
    if (!testDbUrl) return;
    client = postgres(testDbUrl, { max: 1 });
    db = drizzle(client, { schema });
    repo = new DrizzleOrganizationRepository(db);
    service = new OrganizationService(repo);
  });

  afterAll(async () => {
    if (client) {
      if (createdCompanyIds.length > 0) {
        // Deterministic cleanup
        await db
          .delete(schema.branches)
          .where(inArray(schema.branches.company_id, createdCompanyIds));
        await db
          .delete(schema.departments)
          .where(inArray(schema.departments.company_id, createdCompanyIds));
        await db
          .delete(schema.costCenters)
          .where(inArray(schema.costCenters.company_id, createdCompanyIds));
        await db
          .delete(schema.companies)
          .where(inArray(schema.companies.id, createdCompanyIds));
      }
      await client.end();
    }
  });

  test('enforces scoped unique constraints, FK rejection, cross-company access rejection and inactive filtering', async () => {
    const timestamp = Date.now().toString().slice(-6);
    const codeA = `CMP_A_${timestamp}`;
    const codeB = `CMP_B_${timestamp}`;

    // 1. Create two separate companies
    const compA = await service.createCompany({
      code: codeA,
      name: `Company A ${timestamp}`,
    });
    const compB = await service.createCompany({
      code: codeB,
      name: `Company B ${timestamp}`,
    });
    createdCompanyIds.push(compA.id, compB.id);

    // 2. FK Rejection: creating branch on non-existent parent company
    const fakeCompanyId = '00000000-0000-0000-0000-000000000999';
    await expect(
      service.createBranch({
        companyId: fakeCompanyId,
        code: 'BR_FAIL',
        name: 'Fail Branch',
      }),
    ).rejects.toBeInstanceOf(InvalidParentCompanyError);

    // 3. Scoped unique constraint:
    // Create branch with same code 'HQ' on Company A and Company B
    const branchA = await service.createBranch({
      companyId: compA.id,
      code: 'HQ',
      name: 'Company A HQ',
    });
    expect(branchA.companyId).toBe(compA.id);

    const branchB = await service.createBranch({
      companyId: compB.id,
      code: 'HQ',
      name: 'Company B HQ',
    });
    expect(branchB.companyId).toBe(compB.id);

    // Duplicate branch code in SAME company must fail
    await expect(
      service.createBranch({
        companyId: compA.id,
        code: 'HQ',
        name: 'Duplicate A HQ',
      }),
    ).rejects.toBeInstanceOf(DuplicateCodeError);

    // 4. Cross-company access rejection on get & update
    // Attempt to get Company A's branch using Company B's ID
    await expect(
      service.getBranchById(compB.id, branchA.id),
    ).rejects.toBeInstanceOf(OrganizationNotFoundError);

    // Attempt to update Company A's branch under Company B scope
    await expect(
      service.updateBranch(compB.id, branchA.id, { name: 'Comp B overwrite' }),
    ).rejects.toBeInstanceOf(OrganizationNotFoundError);

    // Scoped get & update on Company A succeeds
    const foundBranchA = await service.getBranchById(compA.id, branchA.id);
    expect(foundBranchA.id).toBe(branchA.id);
    const updatedBranchA = await service.updateBranch(compA.id, branchA.id, {
      name: 'Company A HQ Updated',
    });
    expect(updatedBranchA.name).toBe('Company A HQ Updated');

    // 5. Department & Cost Center cross-company scoping
    const deptA = await service.createDepartment({
      companyId: compA.id,
      code: 'IT',
      name: 'IT Department',
    });
    const ccA = await service.createCostCenter({
      companyId: compA.id,
      code: 'CC_IT',
      name: 'IT Cost Center',
    });

    await expect(
      service.getDepartmentById(compB.id, deptA.id),
    ).rejects.toBeInstanceOf(OrganizationNotFoundError);
    await expect(
      service.getCostCenterById(compB.id, ccA.id),
    ).rejects.toBeInstanceOf(OrganizationNotFoundError);

    // 6. Inactive retrieval vs active listing filter
    await service.updateBranch(compA.id, branchA.id, { isActive: false });

    // Active listing excludes branchA
    const activeList = await service.listBranches(compA.id, {
      includeInactive: false,
    });
    expect(activeList.items.find((b) => b.id === branchA.id)).toBeUndefined();

    // Listing with includeInactive includes branchA
    const allList = await service.listBranches(compA.id, {
      includeInactive: true,
    });
    expect(allList.items.find((b) => b.id === branchA.id)).toBeDefined();
  });
});
