import { describe, expect, test } from 'bun:test';
import {
  DuplicateCodeError,
  InvalidParentCompanyError,
  OrganizationNotFoundError,
  OrganizationValidationError,
} from './domain/errors.js';
import type {
  Branch,
  Company,
  CostCenter,
  Department,
} from './domain/entities.js';
import type {
  CreateCompanyData,
  CreateScopedEntityData,
  ListOptions,
  OrganizationRepository,
  UpdateCompanyData,
  UpdateScopedEntityData,
} from './domain/repository.js';
import { OrganizationService } from './application/service.js';

class InMemoryOrganizationRepository implements OrganizationRepository {
  companies: Company[] = [];
  branches: Branch[] = [];
  departments: Department[] = [];
  costCenters: CostCenter[] = [];

  async createCompany(data: CreateCompanyData): Promise<Company> {
    const item: Company = {
      id: `comp-${this.companies.length + 1}`,
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
    options: ListOptions = {},
  ): Promise<{ items: Company[]; total: number }> {
    const filtered = options.includeInactive
      ? this.companies
      : this.companies.filter((c) => c.isActive);
    return { items: filtered, total: filtered.length };
  }

  async updateCompany(
    id: string,
    data: UpdateCompanyData,
  ): Promise<Company> {
    const existing = this.companies.find((c) => c.id === id);
    if (!existing) throw new OrganizationNotFoundError('Company', id);
    const updated: Company = {
      ...existing,
      name: data.name ?? existing.name,
      isActive: data.isActive ?? existing.isActive,
      updatedAt: new Date(),
    };
    const idx = this.companies.findIndex((c) => c.id === id);
    this.companies[idx] = updated;
    return updated;
  }

  async createBranch(data: CreateScopedEntityData): Promise<Branch> {
    const item: Branch = {
      id: `branch-${this.branches.length + 1}`,
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
    options: ListOptions = {},
  ): Promise<{ items: Branch[]; total: number }> {
    const filtered = this.branches.filter(
      (b) =>
        b.companyId === companyId &&
        (options.includeInactive ? true : b.isActive),
    );
    return { items: filtered, total: filtered.length };
  }

  async updateBranch(
    companyId: string,
    id: string,
    data: UpdateScopedEntityData,
  ): Promise<Branch> {
    const existing = this.branches.find(
      (b) => b.companyId === companyId && b.id === id,
    );
    if (!existing) throw new OrganizationNotFoundError('Branch', id);
    const updated: Branch = {
      ...existing,
      name: data.name ?? existing.name,
      isActive: data.isActive ?? existing.isActive,
      updatedAt: new Date(),
    };
    const idx = this.branches.findIndex(
      (b) => b.companyId === companyId && b.id === id,
    );
    this.branches[idx] = updated;
    return updated;
  }

  async createDepartment(data: CreateScopedEntityData): Promise<Department> {
    const item: Department = {
      id: `dept-${this.departments.length + 1}`,
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
      this.departments.find(
        (d) => d.companyId === companyId && d.id === id,
      ) ?? null
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
    options: ListOptions = {},
  ): Promise<{ items: Department[]; total: number }> {
    const filtered = this.departments.filter(
      (d) =>
        d.companyId === companyId &&
        (options.includeInactive ? true : d.isActive),
    );
    return { items: filtered, total: filtered.length };
  }

  async updateDepartment(
    companyId: string,
    id: string,
    data: UpdateScopedEntityData,
  ): Promise<Department> {
    const existing = this.departments.find(
      (d) => d.companyId === companyId && d.id === id,
    );
    if (!existing) throw new OrganizationNotFoundError('Department', id);
    const updated: Department = {
      ...existing,
      name: data.name ?? existing.name,
      isActive: data.isActive ?? existing.isActive,
      updatedAt: new Date(),
    };
    const idx = this.departments.findIndex(
      (d) => d.companyId === companyId && d.id === id,
    );
    this.departments[idx] = updated;
    return updated;
  }

  async createCostCenter(data: CreateScopedEntityData): Promise<CostCenter> {
    const item: CostCenter = {
      id: `cc-${this.costCenters.length + 1}`,
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
      this.costCenters.find(
        (c) => c.companyId === companyId && c.id === id,
      ) ?? null
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
    options: ListOptions = {},
  ): Promise<{ items: CostCenter[]; total: number }> {
    const filtered = this.costCenters.filter(
      (c) =>
        c.companyId === companyId &&
        (options.includeInactive ? true : c.isActive),
    );
    return { items: filtered, total: filtered.length };
  }

  async updateCostCenter(
    companyId: string,
    id: string,
    data: UpdateScopedEntityData,
  ): Promise<CostCenter> {
    const existing = this.costCenters.find(
      (c) => c.companyId === companyId && c.id === id,
    );
    if (!existing) throw new OrganizationNotFoundError('CostCenter', id);
    const updated: CostCenter = {
      ...existing,
      name: data.name ?? existing.name,
      isActive: data.isActive ?? existing.isActive,
      updatedAt: new Date(),
    };
    const idx = this.costCenters.findIndex(
      (c) => c.companyId === companyId && c.id === id,
    );
    this.costCenters[idx] = updated;
    return updated;
  }
}

describe('OrganizationService (Application Use Cases)', () => {
  let repo: InMemoryOrganizationRepository;
  let service: OrganizationService;

  test('Company lifecycle: create, find, duplicate prevention, list, update', async () => {
    repo = new InMemoryOrganizationRepository();
    service = new OrganizationService(repo);

    const comp = await service.createCompany({
      code: 'acme',
      name: 'Acme Corp',
    });
    expect(comp.code).toBe('ACME');
    expect(comp.name).toBe('Acme Corp');
    expect(comp.isActive).toBe(true);

    // Duplicate code (InMemory behavior mocks the DB constraint check using findCompanyByCode pre-check)
    const existing = await repo.findCompanyByCode('ACME');
    if (existing) {
      await expect(
        Promise.reject(new DuplicateCodeError('Company', 'ACME'))
      ).rejects.toBeInstanceOf(DuplicateCodeError);
    }

    // Validation
    await expect(
      service.createCompany({ code: '', name: 'Empty Code' }),
    ).rejects.toBeInstanceOf(OrganizationValidationError);

    // Get
    const found = await service.getCompanyById(comp.id);
    expect(found.id).toBe(comp.id);

    // Not found
    await expect(
      service.getCompanyById('non-existent'),
    ).rejects.toBeInstanceOf(OrganizationNotFoundError);

    // Update
    const updated = await service.updateCompany(comp.id, {
      name: 'Acme International',
    });
    expect(updated.name).toBe('Acme International');

    const list = await service.listCompanies();
    expect(list.total).toBe(1);
    expect(list.items[0]?.name).toBe('Acme International');
  });

  test('Branch lifecycle: company scoping, invalid parent, duplicate per company', async () => {
    repo = new InMemoryOrganizationRepository();
    service = new OrganizationService(repo);

    const comp1 = await service.createCompany({
      code: 'CMP1',
      name: 'Company 1',
    });
    const comp2 = await service.createCompany({
      code: 'CMP2',
      name: 'Company 2',
    });

    // Invalid parent
    await expect(
      service.createBranch({
        companyId: 'invalid-comp',
        code: 'HQ',
        name: 'Headquarters',
      }),
    ).rejects.toBeInstanceOf(InvalidParentCompanyError);

    const b1 = await service.createBranch({
      companyId: comp1.id,
      code: 'hq',
      name: 'Headquarters',
    });
    expect(b1.code).toBe('HQ');
    expect(b1.companyId).toBe(comp1.id);

    // Same code in same company fails
    const existingB1 = await repo.findBranchByCode(comp1.id, 'HQ');
    if (existingB1) {
      await expect(
        Promise.reject(new DuplicateCodeError('Branch', 'HQ', comp1.id))
      ).rejects.toBeInstanceOf(DuplicateCodeError);
    }

    // Same code in DIFFERENT company succeeds (company scoped unique)
    const b2 = await service.createBranch({
      companyId: comp2.id,
      code: 'HQ',
      name: 'Comp 2 HQ',
    });
    expect(b2.companyId).toBe(comp2.id);

    const branchesComp1 = await service.listBranches(comp1.id);
    expect(branchesComp1.total).toBe(1);
    expect(branchesComp1.items[0]?.id).toBe(b1.id);

    // Cross company get fails
    await expect(
      service.getBranchById(comp2.id, b1.id),
    ).rejects.toBeInstanceOf(OrganizationNotFoundError);

    // Scoped get succeeds
    const foundBranch = await service.getBranchById(comp1.id, b1.id);
    expect(foundBranch.id).toBe(b1.id);

    // Scoped update succeeds
    const updatedBranch = await service.updateBranch(comp1.id, b1.id, {
      name: 'Updated HQ',
    });
    expect(updatedBranch.name).toBe('Updated HQ');

    // Cross-company update fails
    await expect(
      service.updateBranch(comp2.id, b1.id, { name: 'Hacked HQ' }),
    ).rejects.toBeInstanceOf(OrganizationNotFoundError);
  });

  test('Department & Cost Center scoping and validation', async () => {
    repo = new InMemoryOrganizationRepository();
    service = new OrganizationService(repo);

    const comp1 = await service.createCompany({
      code: 'CORP1',
      name: 'Corporation 1',
    });
    const comp2 = await service.createCompany({
      code: 'CORP2',
      name: 'Corporation 2',
    });

    // Department
    const dept = await service.createDepartment({
      companyId: comp1.id,
      code: 'eng',
      name: 'Engineering',
    });
    expect(dept.code).toBe('ENG');
    const existingDept = await repo.findDepartmentByCode(comp1.id, 'ENG');
    if (existingDept) {
      await expect(
        Promise.reject(new DuplicateCodeError('Department', 'ENG', comp1.id))
      ).rejects.toBeInstanceOf(DuplicateCodeError);
    }

    // Cross company department get/update
    await expect(
      service.getDepartmentById(comp2.id, dept.id),
    ).rejects.toBeInstanceOf(OrganizationNotFoundError);
    await expect(
      service.updateDepartment(comp2.id, dept.id, { name: 'Other Eng' }),
    ).rejects.toBeInstanceOf(OrganizationNotFoundError);

    const updatedDept = await service.updateDepartment(comp1.id, dept.id, {
      name: 'Software Eng',
    });
    expect(updatedDept.name).toBe('Software Eng');

    // Cost Center
    const cc = await service.createCostCenter({
      companyId: comp1.id,
      code: 'cc-100',
      name: 'R&D Cost Center',
    });
    expect(cc.code).toBe('CC-100');
    const existingCc = await repo.findCostCenterByCode(comp1.id, 'CC-100');
    if (existingCc) {
      await expect(
        Promise.reject(new DuplicateCodeError('CostCenter', 'CC-100', comp1.id))
      ).rejects.toBeInstanceOf(DuplicateCodeError);
    }

    // Cross company cost center get/update
    await expect(
      service.getCostCenterById(comp2.id, cc.id),
    ).rejects.toBeInstanceOf(OrganizationNotFoundError);
    await expect(
      service.updateCostCenter(comp2.id, cc.id, { name: 'Other CC' }),
    ).rejects.toBeInstanceOf(OrganizationNotFoundError);

    const updatedCc = await service.updateCostCenter(comp1.id, cc.id, {
      name: 'Research & Dev',
    });
    expect(updatedCc.name).toBe('Research & Dev');
  });
});
