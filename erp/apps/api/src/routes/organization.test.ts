import { describe, expect, test } from 'bun:test';
import { createApp } from '../app.js';
import type {
  Branch,
  Company,
  CostCenter,
  CreateCompanyData,
  CreateScopedEntityData,
  Department,
  ListOptions,
  OrganizationRepository,
  UpdateCompanyData,
  UpdateScopedEntityData,
} from '@open-erp/organization';

class MockOrganizationRepository implements OrganizationRepository {
  companies: Company[] = [];
  branches: Branch[] = [];
  departments: Department[] = [];
  costCenters: CostCenter[] = [];

  async createCompany(data: CreateCompanyData): Promise<Company> {
    const item: Company = {
      id: '00000000-0000-0000-0000-000000000001',
      code: data.code,
      name: data.name,
      isActive: data.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.companies.push(item);
    return item;
  }

  async findCompanyById(id: string): Promise<Company | null> {
    return this.companies.find((c) => c.id === id) ?? null;
  }

  async findCompanyByCode(code: string): Promise<Company | null> {
    return this.companies.find((c) => c.code === code) ?? null;
  }

  async listCompanies(
    _options: ListOptions = {},
  ): Promise<{ items: Company[]; total: number }> {
    return { items: this.companies, total: this.companies.length };
  }

  async updateCompany(
    id: string,
    data: UpdateCompanyData,
  ): Promise<Company> {
    const existing = this.companies.find((c) => c.id === id);
    if (!existing) throw new Error('Not found');
    const updated: Company = {
      ...existing,
      name: data.name ?? existing.name,
      isActive: data.isActive ?? existing.isActive,
    };
    return updated;
  }

  async createBranch(data: CreateScopedEntityData): Promise<Branch> {
    const item: Branch = {
      id: '00000000-0000-0000-0000-000000000002',
      companyId: data.companyId,
      code: data.code,
      name: data.name,
      isActive: data.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.branches.push(item);
    return item;
  }

  async findBranchById(companyId: string, id: string): Promise<Branch | null> {
    return (
      this.branches.find((b) => b.companyId === companyId && b.id === id) ??
      null
    );
  }

  async findBranchByCode(
    companyId: string,
    code: string,
  ): Promise<Branch | null> {
    return (
      this.branches.find(
        (b) => b.companyId === companyId && b.code === code,
      ) ?? null
    );
  }

  async listBranches(
    companyId: string,
    _options: ListOptions = {},
  ): Promise<{ items: Branch[]; total: number }> {
    const items = this.branches.filter((b) => b.companyId === companyId);
    return { items, total: items.length };
  }

  async updateBranch(
    companyId: string,
    id: string,
    data: UpdateScopedEntityData,
  ): Promise<Branch> {
    const existing = this.branches.find(
      (b) => b.companyId === companyId && b.id === id,
    );
    if (!existing) throw new Error('Not found');
    return {
      ...existing,
      name: data.name ?? existing.name,
      isActive: data.isActive ?? existing.isActive,
    };
  }

  async createDepartment(data: CreateScopedEntityData): Promise<Department> {
    const item: Department = {
      id: '00000000-0000-0000-0000-000000000003',
      companyId: data.companyId,
      code: data.code,
      name: data.name,
      isActive: data.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.departments.push(item);
    return item;
  }

  async findDepartmentById(
    companyId: string,
    id: string,
  ): Promise<Department | null> {
    return (
      this.departments.find((d) => d.companyId === companyId && d.id === id) ??
      null
    );
  }

  async findDepartmentByCode(
    companyId: string,
    code: string,
  ): Promise<Department | null> {
    return (
      this.departments.find(
        (d) => d.companyId === companyId && d.code === code,
      ) ?? null
    );
  }

  async listDepartments(
    companyId: string,
    _options: ListOptions = {},
  ): Promise<{ items: Department[]; total: number }> {
    const items = this.departments.filter((d) => d.companyId === companyId);
    return { items, total: items.length };
  }

  async updateDepartment(
    companyId: string,
    id: string,
    data: UpdateScopedEntityData,
  ): Promise<Department> {
    const existing = this.departments.find(
      (d) => d.companyId === companyId && d.id === id,
    );
    if (!existing) throw new Error('Not found');
    return {
      ...existing,
      name: data.name ?? existing.name,
      isActive: data.isActive ?? existing.isActive,
    };
  }

  async createCostCenter(data: CreateScopedEntityData): Promise<CostCenter> {
    const item: CostCenter = {
      id: '00000000-0000-0000-0000-000000000004',
      companyId: data.companyId,
      code: data.code,
      name: data.name,
      isActive: data.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.costCenters.push(item);
    return item;
  }

  async findCostCenterById(
    companyId: string,
    id: string,
  ): Promise<CostCenter | null> {
    return (
      this.costCenters.find((c) => c.companyId === companyId && c.id === id) ??
      null
    );
  }

  async findCostCenterByCode(
    companyId: string,
    code: string,
  ): Promise<CostCenter | null> {
    return (
      this.costCenters.find(
        (c) => c.companyId === companyId && c.code === code,
      ) ?? null
    );
  }

  async listCostCenters(
    companyId: string,
    _options: ListOptions = {},
  ): Promise<{ items: CostCenter[]; total: number }> {
    const items = this.costCenters.filter((c) => c.companyId === companyId);
    return { items, total: items.length };
  }

  async updateCostCenter(
    companyId: string,
    id: string,
    data: UpdateScopedEntityData,
  ): Promise<CostCenter> {
    const existing = this.costCenters.find(
      (c) => c.companyId === companyId && c.id === id,
    );
    if (!existing) throw new Error('Not found');
    return {
      ...existing,
      name: data.name ?? existing.name,
      isActive: data.isActive ?? existing.isActive,
    };
  }
}

describe('Organization API Routes', () => {
  const repo = new MockOrganizationRepository();
  const app = createApp({ organizationRepository: repo });

  test('POST /api/v1/companies - creates company', async () => {
    const res = await app.request('/api/v1/companies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: 'ACME',
        name: 'Acme Corporation',
      }),
    });

    expect(res.status).toBe(201);
    const json = (await res.json()) as {
      success: boolean;
      data: { code: string; name: string };
    };
    expect(json.success).toBe(true);
    expect(json.data.code).toBe('ACME');
    expect(json.data.name).toBe('Acme Corporation');
  });

  test('POST /api/v1/companies - duplicate code returns 409', async () => {
    const res = await app.request('/api/v1/companies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: 'ACME',
        name: 'Duplicate Acme',
      }),
    });

    expect(res.status).toBe(409);
    const json = (await res.json()) as {
      success: boolean;
      error: { code: string };
    };
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('DUPLICATE_CODE');
  });

  test('GET /api/v1/companies - lists companies', async () => {
    const res = await app.request('/api/v1/companies');
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      success: boolean;
      data: { items: Array<unknown> };
    };
    expect(json.success).toBe(true);
    expect(json.data.items.length).toBe(1);
  });

  test('POST /api/v1/companies/:companyId/branches - creates branch', async () => {
    const res = await app.request(
      '/api/v1/companies/00000000-0000-0000-0000-000000000001/branches',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: 'HQ',
          name: 'Main HQ',
        }),
      },
    );

    expect(res.status).toBe(201);
    const json = (await res.json()) as {
      success: boolean;
      data: { code: string; companyId: string };
    };
    expect(json.success).toBe(true);
    expect(json.data.code).toBe('HQ');
    expect(json.data.companyId).toBe('00000000-0000-0000-0000-000000000001');
  });

  test('POST /api/v1/companies/:companyId/branches - invalid company returns 400', async () => {
    const res = await app.request(
      '/api/v1/companies/00000000-0000-0000-0000-000000000999/branches',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: 'BRANCH2',
          name: 'Branch 2',
        }),
      },
    );

    expect(res.status).toBe(400);
    const json = (await res.json()) as {
      success: boolean;
      error: { code: string };
    };
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('INVALID_PARENT_COMPANY');
  });

  test('GET /api/v1/companies/:companyId/branches/:id - returns branch or 404', async () => {
    const res = await app.request(
      '/api/v1/companies/00000000-0000-0000-0000-000000000001/branches/00000000-0000-0000-0000-000000000002',
    );
    expect(res.status).toBe(200);

    // Cross-company access returns 404
    const crossCompany = await app.request(
      '/api/v1/companies/00000000-0000-0000-0000-000000000999/branches/00000000-0000-0000-0000-000000000002',
    );
    expect(crossCompany.status).toBe(404);

    const notFound = await app.request(
      '/api/v1/companies/00000000-0000-0000-0000-000000000001/branches/00000000-0000-0000-0000-000000000999',
    );
    expect(notFound.status).toBe(404);
  });
});
